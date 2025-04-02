import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { VideoRecord } from '../../shared/model/video-record';

@Component({
  selector: 'app-record-list-item',
  templateUrl: './record-list-item.component.html',
  styleUrls: ['./record-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(click)': 'onHostClick()'
  }
})
export class RecordListItemComponent implements OnChanges, OnDestroy {
  @Input() record?: VideoRecord;
  @Output() readonly removed = new EventEmitter<void>();
  @Output() readonly activated = new EventEmitter();

  protected url?: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['record']) {
      const { currentValue, previousValue } = changes['record'];

      if (currentValue?.blob !== previousValue?.blob) {
        this.cleanupUrl();

        // Create new URL from blob
        this.url = URL.createObjectURL(currentValue.blob);
      }
    }
  }

  ngOnDestroy(): void {
    this.cleanupUrl();
  }

  private cleanupUrl(): void {
    if (this.url) {
      URL.revokeObjectURL(this.url);
      this.url = undefined;
    }
  }

  protected onRemoveClick(event: MouseEvent): void {
    event.stopPropagation()
    this.removed.emit();
  }

  protected onHostClick(): void {
    this.activated.emit();
  }
}
