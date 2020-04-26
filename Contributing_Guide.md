# Contributing Guide

In one word, the reason for this document is consistency! Consistency accross the whole team will ensure we move fast together, we solve issues based on a common ground and consensus, and we will be able to communicate easier.

The second reason for it is Code Quality. Moving forward we want it not only to continue to function properly, but also, more importantly to act as a good platform to add and improve features as the business grows and changes. For this we need a SOLID Foundation.

### Typescript
- VScode will pick up any errors as you type
- To see a list of all possible compilation errors in the project run `yarn tsc` in your terminal
- [ ] Never ignore the compiler - always make sure it compiles correctly. If it doesn't it means it needs a fix, which often times will lead to a better code design so please spend the time to make the compiler happy. It will pay off sooner than you think I promise!
- [ ] This of course means never bypass the compiler by casting to `any` or using compiler ignoring comments. This defeats the purpose of using Typescript in the 1st place, and we won't get any of the goodies it provides.
- [ ] For external libraries to work with typescript, they sometimes come prepackaged with type definitions. But most of the times though you must seperately install them by running `yarn add @types/[my_new_library]`. The reason for this is that type definitions are not always built by the same library authors and so they live in a different repository called [Definitely Typed](https://github.com/DefinitelyTyped/DefinitelyTyped). VSCode will tell you as soon as you import it if it has the types or not.
- [ ] For external libraries without prepackaged types or no Definitely Typed definitions, you need to manually create the definition by declaring a module to the `/declarations.ts` file. But in keep in mind, this is highly not recommended b/c of the added burden of maintaining the types on our own, therefore only proceed in the following cases:
  - you know for sure the library doesn't provide any types (you checked the library's repo, you checked Definitely Typed, you did a google search)
  - you know for sure there are no alternatives to the library that provide types, or the alternatives aren't good enough.
  - the library is not complex (just a small API) and typing it yourself is not that big of a deal.
  - the library will not be used in production (just mocks, storybook, tests, etc...)
  - the library is isolated to a single place or feature

### EsLint
- [ ] Don't ingore linting errors, unless really really can't be avoided. In this situation consider adding a `// eslint-disable-next-line [rule to be disabled]` or even rarer a per file disable `/* eslint-disable [rule to be disabled] */`

### Styling (CSS)
- [ ] Very very very rarely use absolute values (e.g. `width: 112` or `position: absolute; left: 0.123`). Most of the times [flex](https://facebook.github.io/react-native/docs/flexbox) or percentages (e.g. `width: '80%'`) will be enough. This ensures the layout stays responsive accros a variety of devices.
- [ ] Don't use inline styling. Prefer declaring the styles object.

### Storybook
- [ ] Each component should have it's own story file 
- In most of the cases, components will depend on data. Try to at least capture these 2 states: 
  - [ ] Happy - data loaded correctly, and all is good
  - [ ] Error - the data hasn't loaded correctly and there is an error. How does the UI handle that?
- Ideally it should also capture these other 2 states:
  - [ ] Empty (initial State) - Most components will have an empty state at least for a little while. What does that look like?
  - [ ] Loading State - Is the loading state the same as the Empty State? If not, how does it look?

- By capturing all of these different states in stories, your components will automatically be more flexible, more modular and visually tested. Win win win! It also forces you to think of these variations at developing time not at use time, which means your brain has all the information needed already loaded and it will be easier to fix all of the use cases now rather than later.

### Testing
Tests are good because they allow us to move fast when making changes or refactoring without being scared of breaking something that's already used across 3 modules, 7 screens and tons of other components. And changes are unavoidable as the code grows. Two or three months from now when we realize we need an extra property in a component that's used over and over like a `StyledButton` or `TextInput` we wished it had tests to make sure our change doesn't add regression issues.

Try to always add tests when:
- [ ] developing or adding changes to a library - (src/library)
- [ ] developing or adding changes to a service - (src/service)
- [ ] developing or adding changes to a reusable component - (src/components)
- [ ] developing or adding changes to a complex component or module file

### Documentation
There's no point in reiterating how important documentation is, especially when working in a team. We want our code to be (re)used as much as possible. This will keep things DRY and the code clean!

We use [docz](https://www.docz.site/) for writing and publishing documentation. It's as easy as writing an .md or .mdx file next to your code.

Try to always add documentation when:
- [ ] developing or adding changes to a library - (src/library)
- [ ] developing or adding changes to a service - (src/service)
- [ ] developing or adding changes to a reusable component - (src/components)
- [ ] developing or adding changes to a complex component or module file

## Writing the Code

These are mostly inspired by Uncle Bob's [Clean Code Book](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882), Javascript/Typescript and React Best practices.

Btw, I believe Clean Code changed my whole carreer path for the better so if you haven't I strongly suggest you give it a read!

### General Principles
- [ ] Ensure your code is as **decoupled** from other code as possible! This ensures modularity!
- [ ] Naming (for variables, functions, components): Favor very **descriptive** and **specific** names
- [ ] **DRY** - Don't repeat yourself
- [ ] **Be consistent**
- [ ] **KISS** - Keep it stupid simple
- [ ] **Be explicit**, rather than implicit
- [ ] **Follow Conventions** (both Community Standards and Team Standards)
- [ ] **SRP** - Single Responsibilty princinple - Functions should do one thing only and it should do it good!
- [ ] **Don't use comments to explain the code** - Use the code to explain itself by being explicit and descriptive. When not possible take the time to write a good comment.
- [ ] **Commented Code? Delete it** - it's already tracked by git if we ever need to go back to it.

### Conventions
- [ ] **Most functions should be pure**. A function is pure if given the same input returns the same output EVERY SINGLE TIME! See [this](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-a-pure-function-d1c076bec976) for more.
- [ ] **Keep side-effects (impure functions) at bay**. Mostly in the effects.ts files or at the app boundaries, but not where the business logic lives.
- [ ] **Favor functional programming**. See [this](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0).
- [ ] **Never mutate state directly**, especially not in a redux store or a Component state. This messes up with renders and introduces a whole class of bugs.
- [ ] **Don't write types unnecessarily**. Typescript is great at inferring types from implementation code, or from being annotated by using any of the following `typeof`, `keyof`, `ReturnType<typeof [myFunction]>`, rather than rewriting the type definition.
- [ ] **Don't throw errors or exceptions**. Instead return the Error or Exception Instance. Even better return a [MaybeError](/src/lib/maybeError/MaybeError.md) type. This will ensure your function stays pure and it stays strongly types.

### Components
In React, the components are the new functions so they should for the most part follow the same rules:
- [ ] They should be relatively small - if they are too big (more than ~200 lines with styling), consider splitting them in multiple reusable components
- [ ] When extracting a reusable component (from a bigger one), consider where should the new component live:
  - will it certainly be used by other modules? If you are absolutely sure it will then put it in `src/components`
  - will it only be used by the current module, then put it in `src/modules/[current_module]/components`
  - will it be used only by the current screen or main copmonent, then maybe `src/modules/[current_module]/[current_screen]/components` is the right place

Note, it's better to initially place the component as close to the initial implementation as possible, create a story and documentation for it to make it discoverable, and only upgrade it to a higher level in the directory tree when you know for sure it'll be used somewhere else.

The more generic the component is, the more you need to ensure it follows best practices:
- [ ] Capture all possible states in a story. [See the storybook section](#storybook)
- [ ] Test test test. [See the testing section](#testing)
- [ ] Document Document Document. [See the documentation section](#documentation)

Writing components code
- [ ] Prefer Function Components using [hooks](https://reactjs.org/docs/hooks-intro.html) to Classes - the code is simpler and the hooks logic can be reused over multiple components if needed. This doesn't always apply, so use your best judgement.
- [ ] Always Declare the Props Type
- [ ] If writing a Class Component with State, always declare the State Type
- [ ] No need to declare runtime PropTypes b/c thanks to Typescript we have compile time checks


## Project management

- Use the Github Project Board

## Version Control

Follows [Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html).

### Commiting
We use [Commitizen](https://www.npmjs.com/package/commitizen) to ensure all the messages are formatted using the same standard. This ensures readability down the line, and we could also automate actions based on the commits later on. But most importantly it ensure consistentcy across the whole team.

- [ ] Always use the terminal to `commit` changes to git using either one of the following commands `npx git-cz` or `yarn commit` (comming soon). This will open the commitizen terminal prompt.
- [ ] Prefer many small commits that fit in one of the following categories rather than one bulky commit that does too many of these:
  - feat (feature)
  - fix (bug fix)
  - refactor (just cleaning the code, improving readability, etc .)
  - style (css changes/additions)
  - documentation (adding docs)
  - chore (some other stuff not mentioned here)
  - ci
- [ ] Commit often
- [ ] When commiting a bigger, important or breaking change, always provide a commit description that tells
  - what changed
  - why was the change needed (e.g. business requirement, etc)
  - how did it solve the issue/requirement at a high level
- [ ] If it addresses an open issue, add it to the commit message. (e.g. `fix #123`, `close #23` etc.)

### Pushing Code
- [ ] Always Open a PR. If it's still in progress, prefix it with WIP (Work in progress), like for example "WIP - My Car Onboarding Module"
- [ ] Provide a description of what the changes are
- [ ] Reference all of the issues that are being addresed
- [ ] Provide any other relevant information

- [ ] Once it's ready for review, make sure that:
  - [ ] All of the tests pass
  - [ ] There are no compiling errors
  - [ ] There are no linting errors
- [ ] Then assign a Reviewer and wait for it to be reviewed

### Reviewing
- [ ] The Reviewer should look for issues described in this document and request changes based on it

### Merging a PR
- [ ] Once a review is done and everything looks good you can merge the PR branch into the original branch
- Often times the original branch has changed (since other developers might have pushed changes since you branched off to work on the current PR). This is normal. All it means is that now you need to bring your PR branch up to date with the base branch. This means you need to `git rebase [base_branch]`. Rebasing is a whole topic and you can find more about it [here](https://benmarshall.me/git-rebase/).
- [ ] While you are actively rebasing, a lot of times you will have conflicts (code in your branch is different than the new code on the base branch) that git cannot solve on its own so it needs your manual help. This simply means you need to find and fix the conflicts. The good news is that git tells you which files have problems by running `git status` and see all the files that aren't added. See [this](https://docs.openstack.org/doc-contrib-guide/additional-git-workflow/rebase.html) to learn more.
- [ ] Never never never rebase a shared branch (e.g. development or master). See [here](https://www.daolf.com/posts/git-series-part-2/) why.


## Continuous Integration

- TBD