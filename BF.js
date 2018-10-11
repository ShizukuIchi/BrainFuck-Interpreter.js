class BF {
  constructor(commands = "") {
    this.commands = commands;
    this.steps = 1
    this.buffer = ''
    this.ceils = 10
    this.reset();
  }
  add() {
    this.memory[this.ptr] += 1;
    if (this.memory[this.ptr] > 255) this.memory[this.ptr] = 0;
  }
  sub() {
    this.memory[this.ptr] -= 1;
    if (this.memory[this.ptr] < 0) this.memory[this.ptr] = 255;
  }
  addPtr() {
    this.ptr += 1;
    if (this.ptr >= this.memory.length)
      throw new Error("Memory range exceeded!");
  }
  subPtr() {
    this.ptr -= 1;
    if (this.ptr < 0) throw new Error("Negative pointer!");
  }
  getChar() {
    let tmp;
    if (this.buffer.length > 0) {
      tmp = this.buffer.charCodeAt(0);
    } else {
      throw new Error("Buffer reach end!");
    }
    this.buffer = this.buffer.slice(1);
    this.memory[this.ptr] = tmp;
  }
  putChar() {
    this.output += String.fromCharCode(this.memory[this.ptr]);
  }
  loopStart() {
    if (this.memory[this.ptr] === 0) {
      let loops = 1;
      while (loops) {
        this.commandIndex += 1;
        if (this.commands[this.commandIndex] === "[") loops += 1;
        if (this.commands[this.commandIndex] === "]") loops -= 1;
      }
    }
  }
  loopEnd() {
    let loops = 1;
    while (loops) {
      this.commandIndex -= 1;
      if (this.commands[this.commandIndex] === "]") loops += 1;
      if (this.commands[this.commandIndex] === "[") loops -= 1;
    }
    this.commandIndex -= 1;
  }
  next() {
    this.commandIndex += 1;
    this.totalSteps += 1;
  }
  input(str) {
    if (!(typeof str === "string")) {
      throw new Error("Input should be string!");
    }
    this.buffer += str;
  }
  reset() {
    this.commandIndex = 0;
    this.memory = Array(this.ceils).fill(0);
    this.ptr = 0;
    this.output = "";
    this.loops = 0;
    this.totalSteps = 0
    this.stopped = false
  }
  setCeils(ceils) {
    this.ceils = ceils;
  }
  setSteps(steps) {
    this.steps = steps;
  }
  start() {
    this.reset();
    while (this.commandIndex < this.commands.length) {
      const command = this.commands[this.commandIndex];
      switch (command) {
        case "+":
          this.add();
          break;
        case "-":
          this.sub();
          break;
        case ">":
          this.addPtr();
          break;
        case "<":
          this.subPtr();
          break;
        case ",":
          this.getChar();
          break;
        case ".":
          this.putChar();
          break;
        case "[":
          this.loopStart();
          break;
        case "]":
          this.loopEnd();
          break;
        case "\n":
        case " ":
          break;
        default:
          throw new Error(`Command '${command}' not found!`);
      }
      this.next();
    }
    this.stopped = true
    console.log(`Command reach end in ${this.totalSteps} steps.`);
  }
  step(n = this.steps) {
    while (this.commandIndex < this.commands.length && n--) {
      const command = this.commands[this.commandIndex];
      switch (command) {
        case "+":
          this.add();
          break;
        case "-":
          this.sub();
          break;
        case ">":
          this.addPtr();
          break;
        case "<":
          this.subPtr();
          break;
        case ",":
          this.getChar();
          break;
        case ".":
          this.putChar();
          break;
        case "[":
          this.loopStart();
          break;
        case "]":
          this.loopEnd();
          break;
        case "\n":
        case " ":
          break;
        default:
          throw new Error(`Command '${command}' not found!`);
      }
      this.next();
    }
    console.table(this);
    if (this.commandIndex >= this.commands.length) {
      console.log(`Command reach end at step ${this.totalSteps}.`);
      this.stopped = true    
    } else {
      console.log(`Now at step ${this.totalSteps}.`)
    }
  }
}
