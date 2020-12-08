import StitchesRule from '../Rule';

const isStitchesRule = (value: any): value is StitchesRule => Object(value).constructor === StitchesRule;

export default isStitchesRule;
