import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoursesService } from 'src/app/services/courses.service';

import { ICourse } from '../model/course';

@Injectable({
  providedIn: 'root',
})
export class CourseResolver implements Resolve<ICourse> {
  constructor(private courseService: CoursesService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourse> {
    const id = route.params['id'];

    if (route.params && id) {
      return this.courseService.findById(id);
    }

    return of({
      _id: '',
      name: '',
      category: '',
      lessons: [
        {
          id: '',
          name: '',
          youtubeUrl: '',
        },
      ],
    });
  }
}
