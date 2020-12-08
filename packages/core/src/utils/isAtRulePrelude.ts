/** Returns whether a prelude looks like an at-rule. */
const isAtRulePrelude = (prelude: string) => (prelude.charCodeAt(0) === 64) as IsAtRulePrelude<typeof prelude>;

type IsAtRulePrelude<T extends number | string> = T extends `@${string}` ? true : false;

export { isAtRulePrelude as default, IsAtRulePrelude };
