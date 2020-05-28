import DebateDatadb from "./classData/debate";
import InfoDatadb from "./classData/info";

interface Debate {
  id: number;
  title: string;
  description: string;
}
type DebatesViewData = Debate;

export default class DebatesView {
  private _data!: DebatesViewData[];

  private _debateTable = new DebateDatadb(this.refreshData.bind(this));
  private _infoTable = new InfoDatadb(this.refreshData.bind(this));

  get data() {
    return this._data;
  }

  async add(title: string, description: string) {
    await this._infoTable.add({
      id: this._infoTable.data.length,
      description: "",
      current: "",
      counter: "",
    });

    await this._debateTable.add({
      id: this._debateTable.data.length,
      title: title,
      description: description,
      generalNotes: "",
      infoid: this._infoTable.data.length - 1,
    });
  }

  refreshData(): Promise<DebatesViewData[]> {
    return new Promise((resolve, reject) => {
      this.getDebates().then((d) => {
        this._data = d;
        resolve(this._data);
      });
    });
  }

  private getDebates(): Promise<Debate[]> {
    return new Promise((resolve, reject) => {
      // Should eventually be call to db view
      resolve(
        this._debateTable.data.map((d) => {
          return {
            id: d.id,
            title: d.title,
            description: d.description,
          };
        })
      );
    });
  }
}