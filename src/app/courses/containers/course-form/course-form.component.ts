import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from 'src/app/services/courses.service';
import { UtilsFunctions } from 'src/app/shared/utils/UtilsFunctions';

import { ICourse } from '../../model/course';
import { ILesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CoursesService,
    private utilsFunctions: UtilsFunctions,
    private location: Location,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const course: ICourse = this.route.snapshot.data['course'];

    this.form = this.fb.group({
      _id: [course._id],
      name: [
        course.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      category: [course.category, [Validators.required]],
      lessons: this.fb.array(this.retrieveLessons(course)),
    });
  }

  private retrieveLessons(course: ICourse): FormGroup[] {
    const lessons = [];

    if (course?.lessons) {
      course.lessons.forEach((lesson) =>
        lessons.push(this.createLesson(lesson))
      );
    } else {
      lessons.push(this.createLesson());
    }

    return lessons;
  }

  private createLesson(
    lesson: ILesson = { id: '', name: '', youtubeUrl: '' }
  ): FormGroup {
    return this.fb.group({
      id: [lesson.id],
      name: [lesson.name],
      youtubeUrl: [lesson.youtubeUrl],
    });
  }

  public getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  public onSubmit() {
    this.courseService.save(this.form.value).subscribe({
      next: (result) => {
        this.onError('Course created successfully.');

        this.onCancel();
      },
      error: (err) => {
        this.onError('Error creating course.');
      },
    });
  }

  public onCancel() {
    this.location.back();
  }

  public onSuccess(message: string) {
    this.utilsFunctions.showSnack(message);

    this.onCancel();
  }

  private onError(message: string) {
    this.utilsFunctions.showSnack(message);
  }

  public getErrorMessage(formName: string) {
    const field = this.form.get(formName);

    if (field?.hasError('required')) {
      return 'Required field';
    }

    if (field?.hasError('minlength')) {
      const requiredLength = field.errors
        ? field.errors['minlength']['requiredLength']
        : 5;
      return `Minimum length needs to be ${requiredLength}`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength = field.errors
        ? field.errors['maxlength']['requiredLength']
        : 100;
      return `Maximum length needs to be ${requiredLength}`;
    }

    return 'Invalid field';
  }
}
