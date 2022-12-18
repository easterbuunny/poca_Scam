# Contribution rules

## Core product team

* Product Owner: [Arun Aishwarya](https://gaufre.informatique.univ-paris-diderot.fr/poca-a)
* Development Team:
  * [Bouchra Bennani](https://gaufre.informatique.univ-paris-diderot.fr/poca-b)
  * [Carl Christensen](https://gaufre.informatique.univ-paris-diderot.fr/poca-c)
  * [Thomas Bignon](https://gaufre.informatique.univ-paris-diderot.fr/bignon)
  * [Luis Jimenez](https://gaufre.informatique.univ-paris-diderot.fr/jimenez)
  * [FAYCAL Ait benali](https://gaufre.informatique.univ-paris-diderot.fr/aitbenal)
  * [Laura Wang](https://gaufre.informatique.univ-paris-diderot.fr/wangl)
  * [Robin De Sousa Dos Anjos](https://gaufre.informatique.univ-paris-diderot.fr/desousad/)
  * [Lyes FEZOUI](https://gaufre.informatique.univ-paris-diderot.fr/fezoui)


* SCRUM master: Diane Delaunay

## Types of gitlab issues

Developers are assigned user stories. user stories should be as small as possible. The amount of work needed to complete the user story is estimated by the development team:

* S: small user story. Simple and quick to complete.
* M: medium user story. No more than 2 or 3 hours of work.
* L: large user story. It is not easy to imagine what needs to be changed to complete the user story. It should be defined more precisely or/and broken down to smaller user stories if possible.

Bugs should be fixed before new features are added to the product.

## Definition of done

Code under review should be tested.

Installation instructions should always be up to date. If a user story changes how to install the product, the documentation should be updated at the same time.

Bugs and new features should be described briefly in `CHANGELOG.md`.

## Branching

Each user story is implemented on a separate branch named `<contributor>-<user story name>` (e.g. `bouchra-contributing`).

Changes are integrated to the branch `main` after the following steps:

* another member of the development team approved a code review (if the change is important, each member should approve) ;
* the tests are passing ;
* the branch has been rebased on the branch `main`.

See https://medium.com/faun/how-to-rebase-and-merge-with-git-a9c29b2172ad.
