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
import { FormUtilsService } from 'src/app/shared/form/form-utils.service';
import { UtilsFunctions } from 'src/app/shared/utils/UtilsFunctions';

import { ICourse } from '../../model/course';
import { ILesson } from '../../model/lesson';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  public form!: FormGroup;

  public isSubmitting!: boolean;

  constructor(
    private fb: UntypedFormBuilder,
    private courseService: CoursesService,
    private utilsFunctions: UtilsFunctions,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService
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
      lessons: this.fb.array(this.retrieveLessons(course), Validators.required),
    });

    this.isSubmitting = false;
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
      name: [
        lesson.name,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      youtubeUrl: [
        lesson.youtubeUrl,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  public getLessonsFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  public addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  public removeLesson(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  public onSubmit() {
    if (this.form.invalid) {
      this.formUtils.validateAllFormFields(this.form);
      return;
    }

    this.isSubmitting = true;

    this.courseService.save(this.form.value).subscribe({
      next: (result) => {
        this.onError('Course created successfully.');

        this.onCancel();

        this.isSubmitting = false;
      },
      error: (err) => {
        this.onError('Error creating course.');

        this.isSubmitting = false;
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
}
