### TODOs

| Filename                                                                                  | line # | TODO                                                        |
| :---------------------------------------------------------------------------------------- | :----: | :---------------------------------------------------------- |
| [src/exceptions.ts](src/exceptions.ts#L1)                                                 |   1    | define exceptions here                                      |
| [src/index.ts](src/index.ts#L3)                                                           |   3    | make sure that everything is exported                       |
| [src/plugin.ts](src/plugin.ts#L5)                                                         |   5    | use documentation.js to generate documentation in README.md |
| [src/providers/cookies.ts](src/providers/cookies.ts#L3)                                   |   3    | use CDP all cookies method                                  |
| [src/providers/IndexedDB/database-names.ts](src/providers/IndexedDB/database-names.ts#L4) |   4    | change this to an appropriate name                          |
| [src/providers/IndexedDB/set.ts](src/providers/IndexedDB/set.ts#L5)                       |   5    | investigate database versions                               |

### STEALTHs

| Filename                                                            | line # | STEALTH             |
| :------------------------------------------------------------------ | :----: | :------------------ |
| [src/providers/localStorage.ts](src/providers/localStorage.ts#L4)   |   4    | use isolated worlds |
| [src/providers/localStorage.ts](src/providers/localStorage.ts#L12)  |   12   | use isolated worlds |
| [src/providers/IndexedDB/get.ts](src/providers/IndexedDB/get.ts#L4) |   4    | isolated worlds     |
| [src/providers/IndexedDB/set.ts](src/providers/IndexedDB/set.ts#L3) |   3    | isolated worlds     |

### FIXMEs

| Filename                                                            | line # | FIXME                          |
| :------------------------------------------------------------------ | :----: | :----------------------------- |
| [src/providers/IndexedDB/get.ts](src/providers/IndexedDB/get.ts#L3) |   3    | make this TypeScript-compliant |
| [src/providers/IndexedDB/set.ts](src/providers/IndexedDB/set.ts#L4) |   4    | make this TypeScript-compliant |
