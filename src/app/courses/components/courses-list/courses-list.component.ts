import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ICourse } from '../../model/course';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss'],
})
export class CoursesListComponent implements OnInit {
  @Input() courses: ICourse[] = [];

  @Output() eventAddCourse = new EventEmitter();
  @Output() eventEditCourse = new EventEmitter();
  @Output() eventDeleteCourse = new EventEmitter();

  readonly displayedColumns = ['name', 'category', 'actions'];

  constructor() {}

  ngOnInit(): void {}

  public onAddCourse() {
    this.eventAddCourse.emit();
  }

  public onEditCourse(course: ICourse) {
    this.eventEditCourse.emit(course);
  }

  public onDeleteCourse(courseId: number) {
    this.eventDeleteCourse.emit(courseId);
  }
}
