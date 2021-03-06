import DebateDatadb from "./liveClassData/debate";
import ArgumentDatadb from "./liveClassData/argument";
import InfoDatadb from "./liveClassData/info";

import Info from "./elements/infoTbl";
import DebateTbl from "./elements/debateTbl";

export interface Debate {
  id: number;
  title: string;
  info: Info;
  generalnotes: string;
}
export interface Argument {
  id: number;
  title: string;
  description: string;
}
export interface ArgumentsViewData {
  debate: Debate;
  arguments: Argument[];
}

export default class ArgumentsViewdb {
  private _data!: ArgumentsViewData;
  private debateid: number;
  private currentDebate!: DebateTbl;

  private _debateTable = new DebateDatadb();
  private _argumentTable = new ArgumentDatadb();
  private _infoTable = new InfoDatadb();

  constructor(debateid: number) {
    this.debateid = debateid;
  }
  async refreshData() {
    this.currentDebate = await this._debateTable.getSingle(this.debateid);
    if (this.currentDebate.generalnotes === null) {
      this.currentDebate.generalnotes = "";
    }
    const debate = await this.getDebate();
    const args = await this.getArguments();

    this._data = {
      debate: debate,
      arguments: args,
    };
  }

  async addArgument(title: string, description: string) {
    const newInfoid = await this._infoTable.add({
      description: "",
      current: "",
      counter: "",
    });

    await this._argumentTable.add({
      title: title,
      description: description,
      generalnotes: "",
      infoid: newInfoid,
      debateid: this.debateid,
    });

    await this.refreshData();
  }

  async deleteArgument(id: number) {
    await this._argumentTable.delete(id);
  }

  async updateInfo(description: string, current: string, counter: string) {
    const infoid = this.currentDebate.infoid;

    const info = await this._infoTable.getSingle(infoid);
    info.description = description;
    info.current = current;
    info.counter = counter;

    await this._infoTable.update(info);

    await this.refreshData();
  }

  async updateGeneralNotes(notes: string) {
    const updated = this.currentDebate;
    updated.generalnotes = notes;

    await this._debateTable.update(updated);

    await this.refreshData();
  }

  private async getDebate(): Promise<Debate> {
    const infoid = await this._infoTable.getSingle(this.currentDebate.infoid);

    return new Promise((resolve) => {
      resolve({
        id: this.currentDebate.id,
        title: this.currentDebate.title,
        generalnotes: this.currentDebate.generalnotes,
        info: infoid,
      });
    });
  }

  private async getArguments(): Promise<Argument[]> {
    const argumentData = await this._argumentTable.getAll(
      this.currentDebate.id,
    );

    return new Promise((resolve) => {
      resolve(
        // This will be a view in the real db
        argumentData
          .filter((a) => a.debateid === this.debateid)
          .map((a) => {
            return {
              id: a.id,
              title: a.title,
              description: a.description,
            };
          }),
      );
    });
  }

  get data() {
    return this._data;
  }
}
