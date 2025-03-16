/**
 * STACK THAT KEEPS POPPED ITEMS IN MEMORY
 */
class Stack<T> {
  private container: Array<T> = [];
  private _top = -1;

  get top() {
    return this.container[this._top];
  }

  get size() {
    return this._top + 1;
  }

  push(item: T) {
    this._top = this._top + 1;
    if (this._top === this.container.length) this.container.push(item);
    else this.container[this._top] = item;
    if (this.isExtended())
      this.container = this.container.slice(0, this._top + 1);
  }

  pop() {
    if (this._top === -1) return false;
    this._top = this._top - 1;
    return true;
  }

  unpop() {
    if (!this.isExtended()) return false;
    this._top = this._top + 1;
    return true;
  }

  isEmpty() {
    return this.size === 0;
  }

  isExtended() {
    return this.container.length > this._top + 1;
  }

  toArray() {
    if (this._top === -1) return [];
    return this.container.slice(0, this._top + 1);
  }
}

export default Stack;
