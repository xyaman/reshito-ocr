/**
 * @typedef {Object} StoreEntry
 * @property {number} id
 * @property {string} kind
 * @property {string} date
 * @property {string} price
 * @property {string} notes
 *
 */

export class Store {
  constructor() {
    /** @type StoreEntry[] */
    this.data = localStorage.getItem("buys");
    if (this.data) {
      this.data = JSON.parse(this.data);
    } else {
      this.data = [];
    }
  }

  /** It returns a copy of the original array.
   * @returns StoreEntry[]
   */
  getData() {
    return this.data.slice(0);
  }

  /**
   * @param {number} id 
   * @param {StoreEntry} value 
  */
  editValue(id, value) {
    this.data[id] = {
      date: this.data[id].date,
      ...value
    };
    localStorage.setItem("buys", JSON.stringify(this.data));
  }

  /**
   * @param {StoreEntry} value 
  */
  addValue(value) {
    this.data.push({
      date: new Date().toISOString().split("T")[0],
      ...value
    }
    );

    localStorage.setItem("buys", JSON.stringify(this.data));
  }

  /**
   * @param {number} id 
  */
  removeValue(id) {
    this.data.splice(id, 1);
  }
}
