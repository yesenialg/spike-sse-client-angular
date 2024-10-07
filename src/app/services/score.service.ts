import { startWith, Subject } from "rxjs";
import { HealthyScore } from "../entities/healthy-score";

export class ScoreService {
    private API = 'http://localhost:3000/healthy/single-channel';
    private sseSource: EventSource | null = null;
    private scoreSubject$ = new Subject<HealthyScore>();
    public scores$ = this.scoreSubject$.asObservable().pipe(
      startWith({
        steps: 0,
        calories: 0,
      })
    );

    private getFeed(): void {
        this.sseSource = new EventSource(`${this.API}/subscription-scores`);
        
        this.sseSource.addEventListener('message', (e: MessageEvent) => {
          const { training } = JSON.parse(e.data);
    
          this.scoreSubject$.next(training);
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
            console.log("SSE connection closed");
        }
      }
    
  }
  