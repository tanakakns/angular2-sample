import {Injectable} from 'angular2/core';
import {Http}       from 'angular2/http';
import {Person}     from './person';

@Injectable()
export class PersonService {
  	constructor(private http: Http){ }

	  getPerson() {
				var person: Person = new Person();
			  this.http.get('https://tanakakns.github.io/assets/img/person.json')
			           .subscribe(res => {
				 					  person.name = res.json().name;
				 					  person.age = res.json().age;
			           });
				return person;
	  }
}