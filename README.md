# javascript-test
This is the sandbox where I test funny or educational JavaScript pieces.

# Projects
## Typescript router
A small typescript router as a self-executing function that can manage a 
single-page-application in less than 50 lines. Just add the routes:
```ts
Router.add({ route: '/', path: "templates/homepage.html", name: "Homepage" });
Router.add({ route: '/feature', path: "templates/feature.html", name: "Feature" });  
```

Afterwards, you can just compile the typescript and run the server:
```sh
tsc router.ts
live-server
```

## Daylio Data Gather
[DaylioData] is a project to help me get the data from a mood diary app which
won't give me my own data, saved on my Drive. I can access it only by app.
So, I'll add it manualy to a **.json**, because I can.
### Files
 - dayliodatagather.html
 - dayliodatagather.js
### Used
 - Bootstrap 3.3.7
 - jQuery

## Haggling Challenge
This is my application to Hola's [Haggling Challenge]

## Mostly adequate guide
My implementations of the exercises in [Mostly adequate guide to FP]

[DaylioData]: https://vanntile.github.io/javascript-test/daylio_data/dayliodatagather.html
[Haggling Challenge]: https://github.com/hola/challenge_haggling
[Mostly adequate guide to FP]: https://github.com/MostlyAdequate/mostly-adequate-guide
