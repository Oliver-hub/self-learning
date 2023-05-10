export type People = {
  name: string;
  age: number;
}

class Student implements People {
  constructor (public name: string, public age: number, public gender?: string) {
  }

  getName () {
    return this.name
  }
  
  getAge () {
    return this.age
  }
}

export function Hello () {
  let tom = new Student('Tom', 12)
  console.log(tom.getName())

  console.log('Hello, World')
}