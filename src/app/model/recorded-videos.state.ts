import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { VideoRecord } from '../../shared/model/video-record';
import { StorageService } from './storage.service';

// Add new action for initialization
export class GetVideoRecords {
  static readonly type = '[RecordedVideos] Get Videos';
}

export class AddVideoRecord {
  static readonly type = '[RecordedVideos] Add Video';
  constructor(public payload: VideoRecord) {}
}

export class ClearVideoRecords {
  static readonly type = '[RecordedVideos] Clear Videos';
}

export interface RecordedVideosStateModel {
  videos: VideoRecord[];
}

@State<RecordedVideosStateModel>({
  name: 'recordedVideos',
  defaults: {
    videos: []
  }
})
@Injectable()
export class RecordedVideosState {
  constructor(private storageService: StorageService) {}

  @Selector()
  static getVideos(state: RecordedVideosStateModel): VideoRecord[] {
    return state.videos;
  }

  @Action(GetVideoRecords)
  async getList(ctx: StateContext<RecordedVideosStateModel>) {
    try {
      const videos = await this.storageService.getAllVideos();
      ctx.setState({
        videos
      });
    } catch (error) {
      console.error('Failed to initialize videos from IndexedDB:', error);
    }
  }

  @Action(AddVideoRecord)
  async add(ctx: StateContext<RecordedVideosStateModel>, action: AddVideoRecord) {
    try {
      await this.storageService.addVideo(action.payload);
      const state = ctx.getState();
      ctx.setState({
        videos: [...state.videos, action.payload]
      });
    } catch (error) {
      console.error('Failed to add video to IndexedDB:', error);
    }
  }

  @Action(ClearVideoRecords)
  async clear(ctx: StateContext<RecordedVideosStateModel>) {
    try {
      await this.storageService.clearVideos();
      ctx.setState({
        videos: []
      });
    } catch (error) {
      console.error('Failed to clear videos from IndexedDB:', error);
    }
  }
}
