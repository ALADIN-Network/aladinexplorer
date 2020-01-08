import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AlaService } from '../../services/ala.service';
import { Observable, of, timer, combineLatest } from 'rxjs';
import { map, share, switchMap, catchError, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import countryCodeToFlag from "country-code-to-flag";
import { getCountryName } from './countrycodes';
import { fail } from 'assert';

// var country_code = require('./countrycodes')  
var countries = require("i18n-iso-countries");

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
    this.chainStatus$ = timer(0, 6000).pipe(
      switchMap(() => this.alaService.getChainStatus()),
      share()
    );
    //console.log("this.chainStatus$", this.chainStatus$)
    this.oracles$ = timer(0, 6000).pipe(
      switchMap(() => this.alaService.getOraclesTable()),
      share()
    );
    //console.log("this.oracles$", this.oracles$)
    this.oracleReward$ = timer(0, 6000).pipe(
      switchMap(() => this.alaService.getOraclesRewardTable()),
      share()
    );
    //console.log("this.oracleReward$", this.oracleReward$)

    // this.producers1$ = this.oracleReward$.pipe(
    //   switchMap(oracleReward => this.alaService.getOraclesRewardTable().pipe(
    //     map(producers1 => {
    //       //console.log(">>>>>>>>>>>",producers1);
    //       return producers1.map((producer1, index) => {
    //         var test = producers1.total_successful_requests;
    //         //console.log("test",test);
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
    //         //console.log("before wpay: ", reward);
    //         if (percentageVotesRewarded >= 0.5) {
    //           reward += 164.3835616;
    //         }
    //         //console.log("after wpay: ", reward);
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
      this.alaService.getOraclesTable(),
      this.alaService.getRequestTable()
    ).pipe(
      map(([chainStatus, producers, rewardTable, oracleTable, requests]) => {
        const votesToRemove = producers.reduce((acc, cur) => {
          const percentageVotes = cur.total_votes / chainStatus.total_producer_vote_weight * 100;
          if (percentageVotes * 200 < 100) {
            acc += parseFloat(cur.total_votes);
          }
          return acc;
        }, 0);
        return producers.map((producer, index) => {
          //console.log("index",index)
          let position = parseInt(index) + 1;
          //console.log("positon",position)
          let reward = 0;
          let oracleR = 0;
          let failed_request
          oracleTable.map(test => {
            // //console.log("Test",test.producer)
            let test1 = producer.owner;
            //console.log("oracle producer", test.producer)
            //console.log("global producer  ", test1);
            if (test.producer === test1) {
              // console.log("hello");
              console.log("oracle bucket ", chainStatus.oracle_bucket, typeof chainStatus.oracle_bucket);
              console.log("sr ", test.successful_requests, typeof test.successful_requests);
              console.log("tsr ", rewardTable.total_successful_requests, typeof rewardTable.total_successful_requests);
              let op = ((chainStatus.oracle_bucket * test.successful_requests) / rewardTable.total_successful_requests)
              op=(op/10000) - test.failed_requests
              console.log("op: ", op)
              failed_request= test.failed_requests
              console.log("failed_requests",failed_request)
              //oracleR=op
              // oracleR = (op === NaN) ? op : '0';
              if (op === NaN) {
                oracleR = 0
                return oracleR
              } else {
                oracleR = op
                return oracleR
              }
            }
          });
          let percentageVotes = producer.total_votes / chainStatus.total_producer_vote_weight * 100;
          let percentageVotesRewarded = producer.total_votes / (chainStatus.total_producer_vote_weight - votesToRemove) * 100;

          reward += ((chainStatus.perblock_bucket * producer.unpaid_blocks) / chainStatus.total_unpaid_blocks) / 10000;
          console.log("alaio.bpay ", reward);
          if (percentageVotesRewarded >= 0.5) {
            reward += 164.3835616;
          }
          let abc
          abc = countries.numericToAlpha2(producer.location)

          console.log("alaio.bpay+alaio.wpay", reward);
          //console.log("location",producer.location)
          //console.log("code ", abc);

          let xyz;
          xyz = countryCodeToFlag(abc)
          //console.log(xyz)
          abc = getCountryName(abc)
          //console.log("name",abc)

          console.log("Oracle Reward: NaN", oracleR)
          oracleR = (oracleR === NaN) ? 0: oracleR;
          console.log("Oracle Reward: ", oracleR)
          let totalReward
          totalReward = reward + oracleR
            requests.map(x => {
              //console.log(x.id)
            })
          return {
            ...producer,
            position: position,
            reward: reward.toFixed(4),
            votes: percentageVotes.toFixed(2),
            numVotes: (producer.total_votes / 10000),
            oracleReward: oracleR.toFixed(4),
            abc: abc,
            totalReward: totalReward.toFixed(4)
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
    //console.log("vote weight:= " + Math.pow(2, weight_));
    return Math.pow(2, weight_);
  }

}

export const PRODUCERS_COLUMNS = [
  'owner',
  'position',
  'buttontd',
  'location',
  // 'url',
  'numVotes',
  'votes',
  'reward',
  'oracleReward',
  'totalReward'
];