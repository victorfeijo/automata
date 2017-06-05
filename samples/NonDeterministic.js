import makeAutomata from '../src/core/specs/Automata.js';

// L(A) = { x | x E (a,b)* and #a's are odd }
export const nd_automata1 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q0']
  }, {
    state: 'q1', value: 'a', next: ['q0', 'q2']
  }, {
    state: 'q1', value: 'b', next: ['q1']
  }, {
    state: 'q2', value: 'a', next: ['q1']
  }],
  'q0',
  ['q1']
);

export const nd_automata4 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q0']
  }, {
    state: 'q1', value: 'a', next: ['q0','q1', 'q2']
  }, {
    state: 'q1', value: 'b', next: ['q1']
  }, {
    state: 'q2', value: 'a', next: ['q1']
  }],
  'q0',
  ['q1']
);

export const nd_automata5 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q0']
  }, {
    state: 'q1', value: 'a', next: ['q0','q1', 'q3']
  }, {
    state: 'q1', value: 'b', next: ['q1']
  }, {
    state: 'q2', value: 'a', next: ['q1']
  }, {
    state: 'q3', value: 'a', next: ['q3']
  }, {
    state: 'q3', value: 'b', next: ['q2']
  }],
  'q0',
  ['q1']
);
export const nd_automata51 = makeAutomata(
    ['q0', 'q1', 'q2', 'q3', 'q0q1q3'],
    ['a', 'b'],
    [{
      state: 'q0', value: 'a', next: ['q1']
    }, {
      state: 'q0', value: 'b', next: ['q0']
    }, {
      state: 'q1', value: 'b', next: ['q1']
    }, {
      state: 'q2', value: 'a', next: ['q1']
    }, {
      state: 'q3', value: 'a', next: ['q3']
    }, {
      state: 'q3', value: 'b', next: ['q2']
    }, {
      state: 'q0q1q3', value: 'a', next: ['q0', 'q1', 'q3']
    }, {
      state: 'q0q1q3', value: 'b', next: ['q0', 'q1', 'q2']
    }, {
      state: 'q1', value: 'a', next: ['q0q1q3']
    }],
    'q0',
    ['q1', 'q0q1q3']
);

export const nd_automata52 = makeAutomata(
      ['q0', 'q1', 'q2', 'q3', 'q0q1q3'],
      ['a', 'b'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q0']
      }, {
        state: 'q1', value: 'b', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q3', value: 'a', next: ['q3']
      }, {
        state: 'q3', value: 'b', next: ['q2']
      }, {
        state: 'q0q1q3', value: 'b', next: ['q0', 'q1', 'q2']
      }, {
        state: 'q1', value: 'a', next: ['q0q1q3']
      }, {
        state: 'q0q1q3', value: 'a', next: ['q0q1q3']
      }],
      'q0',
      ['q1', 'q0q1q3']
);

export const nd_automata53 = makeAutomata(
    ['q0', 'q1', 'q2', 'q3','q0q1', 'q0q1q3'],
    ['a', 'b'],
    [{
      state: 'q0', value: 'a', next: ['q0q1', 'q1', 'q3']
    }, {
      state: 'q0', value: 'b', next: ['q0']
    }, {
      state: 'q1', value: 'b', next: ['q1']
    }, {
      state: 'q2', value: 'a', next: ['q1']
    }, {
      state: 'q3', value: 'a', next: ['q3']
    }, {
      state: 'q3', value: 'b', next: ['q2']
    }, {
      state: 'q0q1', value: 'a', next: ['q2']
    }, {
      state: 'q0q1q3', value: 'a', next: ['q0', 'q1', 'q2']
    }, {
      state: 'q0q1q3', value: 'b', next: ['q0', 'q1', 'q3']
    }, {
      state: 'q1', value: 'a', next: ['q0q1q3']
    }],
    'q0',
    ['q1', 'q0q1', 'q0q1q3']
);

export const nd_automata6 = makeAutomata(
      ['q0', 'q1', 'q2', 'q3'],
      ['a', 'b', 'c'],
      [{
        state: 'q0', value: 'a', next: ['q1']
      }, {
        state: 'q0', value: 'b', next: ['q2', 'q3']
      }, {
        state: 'q0', value: 'c', next: ['q0', 'q3']
      }, {
        state: 'q1', value: 'a', next: ['q0', 'q3']
      }, {
        state: 'q1', value: 'b', next: ['q3']
      }, {
        state: 'q1', value: 'c', next: ['q1']
      }, {
        state: 'q2', value: 'a', next: ['q1']
      }, {
        state: 'q2', value: 'c', next: ['q0', 'q2', 'q3']
      }, {
        state: 'q3', value: 'a', next: ['q0', 'q3']
      }, {
        state: 'q3', value: 'c', next: ['q1', 'q3']
      }],
      'q0',
      ['q0', 'q3']
);

// ---- HAS EMPTY TRANSITIONS -----
// L(M) = { x E (a | b)* }
export const nd_automata3 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: '&', next: ['q1']
  }, {
    state: 'q0', value: 'a', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q1']
  }, {
    state: 'q2', value: 'a', next: ['q2']
  }],
  'q0',
  ['q1', 'q2']
);

export const nd_automata7 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q2']
  }, {
    state: 'q2', value: '&', next: ['q0', 'q1']
  }, {
    state: 'q2', value: 'b', next: ['q1']
  }],
  'q0',
  ['q2']
);

export const nd_automata8 = makeAutomata(
  ['q0', 'q1', 'q2'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q2']
  }, {
    state: 'q2', value: '&', next: ['ERROR']
  }, {
    state: 'q2', value: 'b', next: ['q1']
  }],
  'q0',
  ['q2']
);

export const nd_automata9 = makeAutomata(
  ['q0', 'q1', 'q2', 'q3'],
  ['a', 'b'],
  [{
    state: 'q0', value: 'a', next: ['q1']
  }, {
    state: 'q0', value: 'b', next: ['q2']
  }, {
    state: 'q1', value: 'b', next: ['q2']
  }, {
    state: 'q2', value: '&', next: ['q1', 'q0']
  }, {
    state: 'q2', value: 'b', next: ['q1']
  }, {
    state: 'q3', value: 'a', next: ['q3']
  }, {
    state: 'q3', value: '&', next: ['q2']
  }],
  'q0',
  ['q2']
);
