export default class TableBase<T> {
  private _data: T[];
  private refresh!: () => Promise<any>;
  private refreshSet: boolean;

  constructor(d: T[], refr?: () => Promise<any>) {
    this._data = d;
    if (refr) {
      this.refresh = refr;
      this.refreshSet = true;
    } else {
      this.refreshSet = false;
    }
  }

  get(condition?: any): Promise<T[]> {
    return new Promise((resolve) => {
      resolve(this._data);
    });
  }

  update(newData: T, id: number) {
    return new Promise((resolve) => {
      this._data[id] = newData;
      this.callRefresh(resolve);
    });
  }
  add(newData: T) {
    return new Promise((resolve) => {
      this._data.push(newData);
      this.callRefresh(resolve);
    });
  }
  delete(id: number) {
    // console.log("id:", id);
    // console.log("old data:", this._data);
    return new Promise((resolve) => {
      const newData = new Array<T>();
      let dataIndex = 0;

      for (let i = 0; i < this._data.length; i++) {
        if (i !== id) {
          newData.push(this._data[i]);
          dataIndex++;
        }
        // else {
        //   console.log("deleting");
        // }
      }

      this._data = newData;

      console.log("new data:", this._data);
      this.callRefresh(resolve);
    });
  }

  getSingle(id: any): Promise<T> {
    return new Promise((resolve) => {
      resolve(this._data[id]);
    });
  }
  size() {
    return this._data.length;
  }

  private callRefresh(resolve: (value?: unknown) => void) {
    if (this.refreshSet) {
      this.refresh().then(() => resolve());
    } else {
      resolve();
    }
  }
}
