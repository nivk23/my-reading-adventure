export const STORIES = [
  {
    id: 'sam-sat',
    title: 'Sam Sat',
    requiredPhonemes: ['m', 's', 'a', 't', 'p', 'i'],
    requiredSightWords: ['a', 'I'],
    pages: [
      { text: 'Sam sat.', illustration: '🧑🪑' },
      { text: 'Sam sat on a mat.', illustration: '🧑🧹' },
      { text: 'I sat on a mat.', illustration: '🙋🧹' },
      { text: 'Sam sat. I sat.', illustration: '🧑🙋🪑' },
      { text: 'Sam sat. I tip-tap, tip-tap.', illustration: '🧑🦶🎵' },
      { text: 'I am Sam. I sat!', illustration: '😊🪑✅' },
    ],
    questions: [
      {
        question: 'Who sat on the mat?',
        answers: ['Sam', 'A cat', 'A pig'],
        correct: 0,
      },
      {
        question: 'What did Sam sit on?',
        answers: ['A mat', 'A pot', 'A tap'],
        correct: 0,
      },
    ],
  },
  {
    id: 'the-big-dog',
    title: 'The Big Dog',
    requiredPhonemes: ['m', 's', 'a', 't', 'p', 'i', 'n', 'o', 'b', 'd', 'g', 'e'],
    requiredSightWords: ['the', 'a', 'is'],
    pages: [
      { text: 'The dog is big.', illustration: '🐶💪' },
      { text: 'The dog sat on a bed.', illustration: '🐶🛏️' },
      { text: 'The dog is on the mat.', illustration: '🐶🧹' },
      { text: 'The dog got a bone.', illustration: '🐶🦴' },
      { text: 'The dog is good.', illustration: '🐶😊' },
      { text: 'The big dog sat. The big dog is the best!', illustration: '🐶⭐🏆' },
    ],
    questions: [
      {
        question: 'What is the dog like?',
        answers: ['Big', 'Small', 'Fast'],
        correct: 0,
      },
      {
        question: 'Where did the dog sit?',
        answers: ['On the bed', 'In the pot', 'On a pin'],
        correct: 0,
      },
      {
        question: 'What did the dog get?',
        answers: ['A bone', 'A bag', 'A net'],
        correct: 0,
      },
    ],
  },
  {
    id: 'mum-and-dad',
    title: 'Mum and Dad',
    requiredPhonemes: ['m', 's', 'a', 't', 'p', 'i', 'n', 'o', 'b', 'd', 'g', 'e', 'c', 'h', 'r', 'u', 'f', 'l'],
    requiredSightWords: ['the', 'a', 'and'],
    pages: [
      { text: 'Mum and Dad run.', illustration: '👩🧔🏃' },
      { text: 'Mum has a red hat.', illustration: '👩🎩❤️' },
      { text: 'Dad has a big bag.', illustration: '🧔👜💪' },
      { text: 'Mum and Dad sit on a rug.', illustration: '👩🧔🪣' },
      { text: 'Mum has the cup. Dad has the mug.', illustration: '👩☕🧔🍵' },
      { text: 'Mum and Dad hug.', illustration: '👨‍👩‍👧🤗' },
      { text: 'Mum and Dad are the best!', illustration: '👩🧔⭐💖' },
    ],
    questions: [
      {
        question: 'What did Mum have on her head?',
        answers: ['A red hat', 'A big bag', 'A cup'],
        correct: 0,
      },
      {
        question: 'Where did Mum and Dad sit?',
        answers: ['On a rug', 'On a bed', 'On a mat'],
        correct: 0,
      },
      {
        question: 'What did Mum and Dad do at the end?',
        answers: ['Hug', 'Run', 'Sit'],
        correct: 0,
      },
    ],
  },
  {
    id: 'at-the-shop',
    title: 'At the Shop',
    requiredPhonemes: ['m', 's', 'a', 't', 'p', 'i', 'n', 'o', 'b', 'd', 'g', 'e', 'c', 'h', 'r', 'u', 'f', 'l', 'sh', 'ch', 'th', 'wh'],
    requiredSightWords: ['the', 'a', 'to', 'is'],
    pages: [
      { text: 'Mum and Sam go to the shop.', illustration: '👩🧒🛍️' },
      { text: 'The shop is big.', illustration: '🏪💪' },
      { text: 'Sam gets a chip.', illustration: '🧒🍟😋' },
      { text: 'Mum gets a fish.', illustration: '👩🐟🛒' },
      { text: 'The fish is fresh.', illustration: '🐟✨💧' },
      { text: '"That is the best chip!" said Sam.', illustration: '🧒🍟⭐' },
      { text: 'Mum and Sam rush to the bus.', illustration: '👩🧒🚌💨' },
    ],
    questions: [
      {
        question: 'Where did Mum and Sam go?',
        answers: ['To the shop', 'To the park', 'To school'],
        correct: 0,
      },
      {
        question: 'What did Sam get?',
        answers: ['A chip', 'A fish', 'A hat'],
        correct: 0,
      },
      {
        question: 'How did Sam get home?',
        answers: ['On the bus', 'In a cab', 'She ran'],
        correct: 0,
      },
    ],
  },
  {
    id: 'the-eel-and-the-bee',
    title: 'The Eel and the Bee',
    requiredPhonemes: ['m', 's', 'a', 't', 'p', 'i', 'n', 'o', 'b', 'd', 'g', 'e', 'c', 'h', 'r', 'u', 'f', 'l', 'sh', 'ch', 'th', 'wh', 'ee', 'ai', 'oa', 'oo', 'ar'],
    requiredSightWords: ['the', 'a', 'and', 'is', 'in'],
    pages: [
      { text: 'The bee is in a big green tree.', illustration: '🐝🌳💚' },
      { text: 'The eel is in the deep pool.', illustration: '🐍💧🌊' },
      { text: '"I can see you!" said the bee.', illustration: '🐝👀🐍' },
      { text: '"I can see the moon!" said the eel.', illustration: '🐍🌕✨' },
      { text: 'The bee and the eel are the best of pals.', illustration: '🐝🤝🐍' },
      { text: 'The bee sat in the cool shade.', illustration: '🐝🌳😌' },
      { text: 'The eel swam in the deep pool.', illustration: '🐍🌊💧' },
      { text: 'Good night, bee! Good night, eel!', illustration: '🐝🌙🐍⭐' },
    ],
    questions: [
      {
        question: 'Where does the bee live?',
        answers: ['In a green tree', 'In a deep pool', 'In a shop'],
        correct: 0,
      },
      {
        question: 'Where does the eel live?',
        answers: ['In the deep pool', 'In the tree', 'On the mat'],
        correct: 0,
      },
      {
        question: 'What did the eel see?',
        answers: ['The moon', 'The bee', 'A chip'],
        correct: 0,
      },
    ],
  },
];
