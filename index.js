let ran = false;
let bf = {};
let overlay = false;
let steps = 1;
document.querySelector('#run').onclick = () => {
  if (!checkInput()) return;
  ran = false;
  document.querySelector('#output').innerText = '';
  bf = new BF(document.querySelector('#code').value);
  bf.input(document.querySelector('#input').value);
  try {
    bf.start();
    document.querySelector('#output').innerText = bf.output;
    document.querySelector('#alert').innerText = `Done! Total steps: ${
      bf.totalSteps
    }.`;
  } catch (e) {
    document.querySelector('#alert').innerText = e;
  }
};
document.querySelector('#step').onclick = () => {
  if (!checkInput()) return;
  if (ran == false) {
    document.querySelector('#step').innerText = 'Step';
    document.querySelector('#output').innerText = '';
    bf = new BF(document.querySelector('#code').value);
    bf.setSteps(steps);
    bf.input(document.querySelector('#input').value);
    console.log('Click "Step" again to execute step by step.');
    document.querySelector('#alert').innerText = 'Please open console.';
    ran = true;
  } else {
    try {
      bf.step();
      document.querySelector('#output').innerText = bf.output;
      if (bf.stopped) {
        ran = false;
        document.querySelector('#alert').innerText = `Done! Total steps: ${
          bf.totalSteps
        }.`;
        document.querySelector('#step').innerText = 'Restart';
      }
    } catch (e) {
      ran = false;
      document.querySelector('#alert').innerText = e;
      document.querySelector('#step').innerText = 'Restart';
    }
  }
};

document.querySelector('#reset').onclick = () => {
  document
    .querySelectorAll('textarea')
    .forEach(textarea => (textarea.value = ''));
  document.querySelector('#alert').innerText = '';
};

function checkInput() {
  const code = document.querySelector('#code').value;
  if (code.length === 0) {
    document.querySelector('#alert').innerText = 'No code!';
    return false;
  }
  document.querySelector('#alert').innerText = '';
  return true;
}

document.querySelector('.settings').onclick = () => {
  if (!overlay) {
    document.querySelector('#steps').innerText = steps;
    document.querySelector('.settings-overlay').style.visibility = 'visible';
    document.querySelector('.settings-overlay').style.opacity = 1;
    overlay = true;
  }
};
document.querySelector('.settings-overlay').onclick = e => {
  if (overlay && e.target === document.querySelector('.settings-overlay')) {
    document.querySelector('.settings-overlay').style.opacity = 0;
    document.querySelector('.settings-overlay').style.visibility = 'hidden';
    overlay = false;
  }
};
document.querySelector('#sub-step').onclick = () => {
  if (steps > 1) steps -= 1;
  document.querySelector('#steps').innerText = steps;
};
document.querySelector('#add-step').onclick = () => {
  steps += 1;
  document.querySelector('#steps').innerText = steps;
};
