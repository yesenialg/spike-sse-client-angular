import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { startWith, Subject } from "rxjs";
import { GameScore } from "./game-score";

export class ScoreService {
    private API = 'http://localhost:3000/games';
    private sseSource: EventSource | null = null;
    //private http = inject(HttpClient);
    private scoreSubject$ = new Subject<GameScore>();
    public scores$ = this.scoreSubject$.asObservable().pipe(
      startWith({
        lakers: 0,
        denver: 0,
      })
    );

    private getFeed(): void {
        this.sseSource = new EventSource(`${this.API}/scores`);
        
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
        //this.http.post(`${this.API}/stop`, {});
        if (this.sseSource) {
            this.sseSource.close();
            this.sseSource = null;
            console.log("Conexión SSE cerrada");
        }
      }
    
  }
  