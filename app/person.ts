export class Person {
  private _name: string;
  private _age: number;
  get name() {
    return this._name;
  }
  set name(value:string) {
    this._name = value;
  }
  get age() {
    return this._age;
  }
  set age(value:number) {
    this._age = value;
  }
}