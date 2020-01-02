import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AlaService } from '../../services/ala.service';
import { Observable, of, timer, combineLatest } from 'rxjs';
import { map, share, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  templateUrl: './producers.component.html',
  styleUrls: ['./producers.component.scss']
})
export class ProducersComponent implements OnInit {

  columnHeaders$: Observable<string[]> = of(PRODUCERS_COLUMNS);
  producers$: Observable<any[]>;
  chainStatus$: Observable<any>;
  oracles$: Observable<any>;
  oracleReward$: Observable<any>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private alaService: AlaService
  ) { }

  ngOnInit() {
    this.columnHeaders$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map(result => result.matches ? PRODUCERS_COLUMNS.filter((c: any) => (c !== 'url' && c !== 'numVotes')) : PRODUCERS_COLUMNS)
    );
    this.chainStatus$ = timer(0, 60000).pipe(
      switchMap(() => this.alaService.getChainStatus()),
      share()
    );
    console.log("this.chainStatus$", this.chainStatus$)
    this.oracles$ = timer(0, 60000).pipe(
      switchMap(() => this.alaService.getOraclesTable()),
      share()
    );
    console.log("this.oracles$", this.oracles$)
    this.oracleReward$ = timer(0, 60000).pipe(
      switchMap(() => this.alaService.getOraclesRewardTable()),
      share()
    );
    console.log("this.oracleReward$", this.oracleReward$)

    // this.producers1$ = this.oracleReward$.pipe(
    //   switchMap(oracleReward => this.alaService.getOraclesRewardTable().pipe(
    //     map(producers1 => {
    //       console.log(">>>>>>>>>>>",producers1);
    //       return producers1.map((producer1, index) => {
    //         var test = producers1.total_successful_requests;
    //         console.log("test",test);
    //         return {
    //           ...producer1,
    //         }
    //       });
    //     })
    //   )),
    //   share()
    // );


    // this.producers$ = this.chainStatus$.pipe(
    //   switchMap(chainStatus => this.alaService.getProducers().pipe(
    //     map(producers => {
    //       const votesToRemove = producers.reduce((acc, cur) => {
    //         const percentageVotes = cur.total_votes / chainStatus.total_producer_vote_weight * 100;
    //         if (percentageVotes * 200 < 100) {
    //           acc += parseFloat(cur.total_votes);
    //         }
    //         return acc;
    //       }, 0);
    //       return producers.map((producer, index) => {
    //         let position = parseInt(index) + 1;
    //         let reward = 0;
    //         let oracleR = 0;
    //         let percentageVotes = producer.total_votes / chainStatus.total_producer_vote_weight * 100;
    //         let percentageVotesRewarded = producer.total_votes / (chainStatus.total_producer_vote_weight - votesToRemove) * 100;
    //         reward += ((chainStatus.perblock_bucket * producer.unpaid_blocks) / chainStatus.total_unpaid_blocks) / 10000;
    //         console.log("before wpay: ", reward);
    //         if (percentageVotesRewarded >= 0.5) {
    //           reward += 164.3835616;
    //         }
    //         console.log("after wpay: ", reward);
    //         return {
    //           ...producer,
    //           position: position,
    //           reward: reward.toFixed(4),
    //           votes: percentageVotes.toFixed(2),
    //           numVotes: (producer.total_votes / 10000)
    //         }

    //       });
    //     }),
    //   )),
    //   share(),
    // );

    this.producers$ = combineLatest(
      this.chainStatus$,
      this.alaService.getProducers(),
      this.alaService.getOraclesRewardTable(),
      this.alaService.getOraclesTable()
    ).pipe(
      map(([chainStatus, producers, rewardTable, oracleTable]) => {
        const votesToRemove = producers.reduce((acc, cur) => {
          const percentageVotes = cur.total_votes / chainStatus.total_producer_vote_weight * 100;
          if (percentageVotes * 200 < 100) {
            acc += parseFloat(cur.total_votes);
          }
          return acc;
        }, 0);
        return producers.map((producer, index) => {
          let position = parseInt(index) + 1;
          let reward = 0;
          let oracleR = 0;
          oracleR = ((chainStatus.oracle_bucket * oracleTable.successful_requests) / rewardTable.total_successful_requests);
          let percentageVotes = producer.total_votes / chainStatus.total_producer_vote_weight * 100;
          let percentageVotesRewarded = producer.total_votes / (chainStatus.total_producer_vote_weight - votesToRemove) * 100;
          reward += ((chainStatus.perblock_bucket * producer.unpaid_blocks) / chainStatus.total_unpaid_blocks) / 10000;
          console.log("before wpay: ", reward);
          if (percentageVotesRewarded >= 0.5) {
            reward += 164.3835616;
          }
          console.log("after wpay: ", reward);
          return {
            ...producer,
            position: position,
            reward: reward.toFixed(4),
            votes: percentageVotes.toFixed(2),
            numVotes: (producer.total_votes / 10000),
            oracleReward: oracleR
          }

        });
      }),
      share()
    );
  }

  private calculateVoteWeight() {
    //time epoch:
    //https://github.com/ALAIO/ala/blob/master/contracts/alaiolib/time.hpp#L160
    //stake to vote
    //https://github.com/ALAIO/ala/blob/master/contracts/alaio.system/voting.cpp#L105-L109
    let timestamp_epoch: number = 946684800000;
    let dates_: number = (Date.now() / 1000) - (timestamp_epoch / 1000);
    let weight_: number = Math.floor(dates_ / (86400 * 7)) / 52;  //86400 = seconds per day 24*3600
    console.log("vote weight:= " + Math.pow(2, weight_));
    return Math.pow(2, weight_);
  }

}

export const PRODUCERS_COLUMNS = [
  'owner',
  'position',
  'buttontd',
  'url',
  'numVotes',
  'votes',
  'reward',
  'oracleReward'
];