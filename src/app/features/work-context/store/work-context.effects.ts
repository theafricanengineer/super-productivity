import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { filter, map, tap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as contextActions from './work-context.actions';
import { PersistenceService } from '../../../core/persistence/persistence.service';
import { SetSelectedTask } from '../../tasks/store/task.actions';
import { TaskService } from '../../tasks/task.service';
import { BannerId } from '../../../core/banner/banner.model';
import { BannerService } from '../../../core/banner/banner.service';
import { Observable } from 'rxjs';

@Injectable()
export class WorkContextEffects {
  // TODO improve
  // updateContextsStorage$ = createEffect(() => this._actions$.pipe(
  //   ofType(
  //     contextActions.setActiveWorkContext,
  //   ),
  //   withLatestFrom(
  //     this._store$.pipe(select(selectContextFeatureState)),
  //   ),
  //   tap(this._saveToLs.bind(this)),
  // ), {dispatch: false});

  dismissContextScopeBannersOnContextChange: Observable<unknown> = createEffect(() => this._actions$
    .pipe(
      ofType(
        contextActions.setActiveWorkContext,
      ),
      tap(() => {
        // this._bannerService.dismissIfExisting(BannerId.ForgotToFinishDay);
        this._bannerService.dismissIfExisting(BannerId.JiraUnblock);
      }),
    ), {dispatch: false});

  // EXTERNAL
  // --------
  // unsetCurrentTask$ = createEffect(() => this._actions$.pipe(
  //   ofType(contextActions.setActiveWorkContext),
  //   withLatestFrom(this._taskService.isTaskDataLoaded$),
  //   filter(([, isDataLoaded]) => isDataLoaded),
  //   map(() => new UnsetCurrentTask()),
  // ));

  unselectSelectedTask$: Observable<unknown> = createEffect(() => this._actions$.pipe(
    ofType(contextActions.setActiveWorkContext),
    withLatestFrom(this._taskService.isTaskDataLoaded$),
    filter(([, isDataLoaded]) => isDataLoaded),
    map(() => new SetSelectedTask({id: null})),
  ));

  constructor(
    private _actions$: Actions,
    private _store$: Store<any>,
    private _persistenceService: PersistenceService,
    private _taskService: TaskService,
    private _bannerService: BannerService,
  ) {
  }
}
