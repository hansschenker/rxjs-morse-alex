import {
  fromEvent,
  bufferTime,
  interval,
  sample,
  map,
  mapTo,
  sampleTime,
  scan,
  withLatestFrom,
  combineLatest,
  repeat,
  take,
  timeInterval,
  auditTime,
  BehaviorSubject,
  tap,
  pairwise,
  filter,
  merge,
  takeUntil,
  mergeMap,
  exhaustMap,
  ReplaySubject,
  timer,
  switchMap,
  reduce,
} from "rxjs";

// keyup -> number
const keyups = fromEvent<KeyboardEvent>(document, "keyup").pipe(
  filter((e) => e.code === "Space"),
  map((_) => Date.now()),
  take(1)
);
// keydown -> number
const keydowns = fromEvent<KeyboardEvent>(document, "keydown").pipe(
  filter((e) => e.code === "Space"),
  map((_) => Date.now()),
  take(1)
);
// ******************************
const keys = combineLatest(keyups, keydowns)
  .pipe(repeat())
  .pipe
  // tap(timer(1000).pipe(tap((_) => MorseState.next(["/"])))),
  ()
  .subscribe((val) => console.log("keys:", val));

function toMorseCode(down: number, up: number): string[] {
  const diff = up - down;
  //TimestampState.next([diff]);
  console.log("diff:", diff);
  const morse =
    diff < 250
      ? "." //console.log('short:',diff)
      : diff < 700
      ? "-" //console.log('long',diff)
      : "/";

  return [morse];
}

function collectDotsAndDashes() {}

keydowns.pipe(
  switchMap((down) =>
    keyups.pipe(
      map((up) => toMorseCode(down, up)),
      reduce(collectDotsAndDashes),
      takeUntil(timer(5000).pipe(takeUntil(keydowns), repeat())),
      repeat()
    )
  )
);
