import { startWith, Subject } from "rxjs";
import { GameScore } from "../entities/game-score";

export class ScoreService {
    private API = 'http://localhost:3000/games/canal-unico';
    private sseSource: EventSource | null = null;
    private scoreSubject$ = new Subject<GameScore>();
    public scores$ = this.scoreSubject$.asObservable().pipe(
      startWith({
        lakers: 0,
        denver: 0,
      })
    );

    private getFeed(): void {
        this.sseSource = new EventSource(`${this.API}/scores-subscribe`);
        
        this.sseSource.addEventListener('message', (e: MessageEvent) => {
          const { game } = JSON.parse(e.data);
    
          this.scoreSubject$.next(game);
        });
    
        this.sseSource.onerror = () => {
          console.error('sse error');
        };
      }
    
      public start(): void {
        this.getFeed();
      }
      public stop(): void {
        if (this.sseSource) {
            this.sseSource.close();
            this.sseSource = null;
            console.log("Conexión SSE cerrada");
        }
      }
    
  }
  