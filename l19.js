import { vocab } from "./vocab.js";

// Helper function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Create circular iterators for each vocab type
class CircularIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
    }

    next() {
        const value = this.array[this.index];
        this.index = (this.index + 1) % this.array.length;
        return value;
    }
}

// Initialize iterators
async function initializeVocab() {
    for (const key in vocab) {
        shuffleArray(vocab[key]);
        vocab[key] = new CircularIterator(vocab[key]);
    }
}

function n(plural = false) {
    let item = vocab.nouns.next();
    if (Math.random() < 0.15) {
        item = vocab.prefixes.next() + item;
    }
    if (Math.random() < 0.15) {
        item = item + vocab.suffixes.next();
    }
    if (plural) {
        if (item.toLowerCase().endsWith('s')) {
            return item + 'es';
        }
        return item + 's';
    }
    return item;
}

function v(tense = 0) {
    if (tense === 3) {
        let item = vocab.verbs.next()[0];
        if ('aeiou'.includes(item[item.length - 1])) {
            item = item.slice(0, -1);
        }
        return item + 'ing';
    }
    return vocab.verbs.next()[tense];
}

function adj() {
    let item = vocab.adjectives.next();
    if (Math.random() < 0.15) {
        item = vocab.adverbs.next() + item;
    }
    return item;
}

async function speak() {    
    const templates = [
        () => `It seems that you have been living two lives. In one life, you are ${n().charAt(0).toUpperCase() + n().slice(1)}, ${n()} ${v(2)} for a respectable ${n()} company. You have a ${n()}, you ${v()} your ${n()} and you help your land lady ${v()} her ${n()}.`,
        () => `You ${v()} like they do. I've never seen anyone ${v()} that ${adj()}.`,
        () => `Most of my ${n()} you already ${v()}.`,
        () => `I know why you wanna ${v()} me. 'Cuz ${n()} is all the world's even seen lately.`,
        () => `You can ${v()} that ${n()} through this life if you want but you cant ${v()} that ${n()} off that ${n()} (No sir).`,
        () => `${n().charAt(0).toUpperCase() + n().slice(1)} ${['II', 'III', 'IV', 'V', 'VI'][Math.floor(Math.random() * 5)]}: The Sequel to ${n().charAt(0).toUpperCase() + n().slice(1)}`,
        () => `Well well well, if it isn't the ${adj()} ${n()} Nicholas.`,
        () => `Can you store the ${adj()} ${n()} with air? Or not`,
        () => `The shepherd ${v(1)} at ${adj()} ${n()}, whose withered ${n()} had just reached into the coat pocket. "Why have you come here?" uttered the shepherd, trying to ignore the ${n()} level reading he glanced from the scanner. "I'm here for ${n()}19".`,
        () => `In ${adj()}, ${adj()} prose, she ${v(1)} how a beloved star was exposed as a violent ${n()}, and how ${n()}'s conviction became the first of the ${n()} era.`,
        () => `No ${n()} could stop them. In their ${adj()} pride, ${('the ' + n(true) + ' of ' + n()).toUpperCase()} ${v(1)} on their commander's base like ${n(true)} in the winds of ${n()}.`,
        () => `The ${n()} of Shokam's ${adj()} ${n()} let loose on top of ${n().charAt(0).toUpperCase() + n().slice(1)} creek. Blood ${v(1)} down on the soldiers as they ${v(1)} in their huts. "${n().charAt(0).toUpperCase() + n().slice(1)}", said the Lieutenant.`,
        () => `I've seen ${n(true)} you people wouldn't believe. ${adj()} ${n(true)} on fire off the ${n()} of Orion. I watched C-${n(true)} ${v()} in the dark near the ${n().charAt(0).toUpperCase() + n().slice(1)}häuser Gate. All those moments will be lost in time, like tears in the ${n()}. Time to die.`,
        () => `I am quite ${adj()}. Look at those ${n(true)}. The boys want to get the ${n(true)} into bed so they can have their ${n()} ${n(true)} off their ${n()} and forth. When a ${n()} ${v()}s his ${n()} you don't call it love. Why get all misty-${n()}'d when a ${n()} ${v()}s another part of his anatomy?`,
        () => `In the hospital men's room, as I'm ${v(3)} my ${n(true)}, I glance in the mirror. The ${n()} I see is not so much me as my ${n()}. When did he show up? There is no soap; I rub ${n()} sanitizer into my ${n()}--it burns. I nearly ${v()} myself in the sink trying to rinse it off.`,
        () => `The question is in a way ${adj()}, she ${v(3)}, but one must ask. ${n().charAt(0).toUpperCase() + n().slice(1)} in such situations is rarely ${adj()}. Sex is the engine, exalting and ruining people, sex and frustration. ${n().charAt(0).toUpperCase() + n().slice(1)} is what people believe is worth the path of devastation.`
    ];

    let item = templates[Math.floor(Math.random() * templates.length)]();
    
    if (Math.random() < 0.2) {
        item = item + "\n" + `Neo: That's why it's going to ${v()}.`;
    }
    
    return item;
}

await initializeVocab();

export { speak }; 