import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { CoursesService } from 'src/app/services/courses.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { UtilsFunctions } from 'src/app/shared/utils/UtilsFunctions';

import { ICourse } from '../../model/course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<ICourse[]>;

  displayedColumns = ['name', 'category', 'actions'];

  constructor(
    private coursesService: CoursesService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private utilsFunctions: UtilsFunctions,
  ) {
    this.courses$ = this.getAllCourses();
  }

  ngOnInit(): void {
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg,
    })
  }

  onAddCourse() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onEditCourse(course: ICourse) {
    this.router.navigate(['edit', course._id], { relativeTo: this.route });
  }

  onDeleteCourse(courseId: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to remove this course?'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if(confirmed) {
        this.coursesService.delete(courseId).subscribe({
          next: result => {
            this.onSuccess('Course deleted succesfully');
          },
          error: err => {
            this.onError('Error deleting course.');
          }
        })
      }
    });
  }

  onSuccess(message: string) {
    this.utilsFunctions.showSnack(
      message,
      'X',
      {
        verticalPosition: 'top',
        horizontalPosition: 'center',
      }
    );

    this.courses$ = this.getAllCourses();
  }

  getAllCourses() {
    return this.coursesService.findAll()
      .pipe(
        catchError(error => {
          console.log(error);

          this.onError('Error loading courses.');

          return of([]);
        })
      );
  }
}
