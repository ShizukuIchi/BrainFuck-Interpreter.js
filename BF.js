class BF {
  constructor(commands = '', options = {}) {
    this.options = options;
    this.commands = commands;
    this.buffer = '';
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
      throw new Error('Memory range exceeded!');
  }
  subPtr() {
    this.ptr -= 1;
    if (this.ptr < 0) throw new Error('Negative pointer!');
  }
  getChar() {
    let tmp;
    if (this.buffer.length > 0) {
      tmp = this.buffer.charCodeAt(0);
    } else {
      throw new Error('Buffer reach end!');
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
        if (this.commands[this.commandIndex] === '[') loops += 1;
        if (this.commands[this.commandIndex] === ']') loops -= 1;
      }
    }
  }
  loopEnd() {
    let loops = 1;
    while (loops) {
      this.commandIndex -= 1;
      if (this.commands[this.commandIndex] === ']') loops += 1;
      if (this.commands[this.commandIndex] === '[') loops -= 1;
    }
    this.commandIndex -= 1;
  }
  next() {
    this.commandIndex += 1;
  }
  read(str) {
    if (!(typeof str === 'string')) {
      throw new Error('Input should be string!');
    }
    this.buffer += str;
  }
  readline(str) {
    this.read(`${str}\n`);
  }
  reset() {
    this.commandIndex = 0;
    this.memory = Array(
      this.options.ceils ? Number(this.options.ceils) : 1000,
    ).fill(0);
    this.ptr = 0;
    this.output = '';
    this.loops = 0;
  }
  start() {
    this.reset();
    while (this.commandIndex < this.commands.length) {
      const command = this.commands[this.commandIndex];
      switch (command) {
        case '+':
          this.add();
          break;
        case '-':
          this.sub();
          break;
        case '>':
          this.addPtr();
          break;
        case '<':
          this.subPtr();
          break;
        case ',':
          this.getChar();
          break;
        case '.':
          this.putChar();
          break;
        case '[':
          this.loopStart();
          break;
        case ']':
          this.loopEnd();
          break;
        case '\n':
        case ' ':
          break;
        default:
          throw new Error(`Command '${command}' not found!`);
      }
      this.next();
    }
  }
  step(n = 1) {
    while (this.commandIndex < this.commands.length && n--) {
      const command = this.commands[this.commandIndex];
      switch (command) {
        case '+':
          this.add();
          break;
        case '-':
          this.sub();
          break;
        case '>':
          this.addPtr();
          break;
        case '<':
          this.subPtr();
          break;
        case ',':
          this.getChar();
          break;
        case '.':
          this.putChar();
          break;
        case '[':
          this.loopStart();
          break;
        case ']':
          this.loopEnd();
          break;
        case '\n':
        case ' ':
          break;
        default:
          throw new Error(`Command '${command}' not found!`);
      }
      this.next();
    }
    if (this.commandIndex === this.commands.length) {
      console.log('Command reach end.');
      n = 0;
    }
    console.table(this);
  }
}

let ran = false;
let bf;
document.querySelector('#run').onclick = () => {
  ran = false;
  document.querySelector('#output span').innerText = '';
  bf = new BF(document.querySelector('#code input').value);
  bf.read(document.querySelector('#input input').value);
  bf.start();
  document.querySelector('#output span').innerText = bf.output;
};
document.querySelector('#step').onclick = () => {
  if (ran == false) {
    document.querySelector('#output span').innerText = '';
    bf = new BF(document.querySelector('#code input').value);
    bf.read(document.querySelector('#input input').value);
    console.log('new bf started');
    ran = true;
  } else {
    bf.step();
    document.querySelector('#output span').innerText = bf.output;
  }
};
