import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { VideoRecord } from '../../shared/model/video-record';

// Actions
export class AddVideoRecord {
  static readonly type = '[RecordedVideos] Add Video';
  constructor(public payload: VideoRecord) {}
}

export class ClearVideoRecords {
  static readonly type = '[RecordedVideos] Clear Videos';
}

// State model
export interface RecordedVideosStateModel {
  videos: VideoRecord[];
}

// Initial state
@State<RecordedVideosStateModel>({
  name: 'recordedVideos',
  defaults: {
    videos: []
  }
})
@Injectable()
export class RecordedVideosState {
  @Selector()
  static getVideos(state: RecordedVideosStateModel): VideoRecord[] {
    return state.videos;
  }

  @Action(AddVideoRecord)
  add(ctx: StateContext<RecordedVideosStateModel>, action: AddVideoRecord) {
    const state = ctx.getState();
    ctx.setState({
      videos: [...state.videos, action.payload]
    });
  }

  @Action(ClearVideoRecords)
  clear(ctx: StateContext<RecordedVideosStateModel>) {
    ctx.setState({
      videos: []
    });
  }
}
