import { Component, OnInit } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AF } from "../../providers/af";

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.css']
})
export class InsertComponent implements OnInit {

private text;
private students = [];
private str = '' ;
private team = 'בית ספר אל תור - בנות';

  constructor(private afService: AF) { }

  private readSingleFile(e) {
    var fileName = e.target.files[0];
    console.log("f   "+fileName);
    if (!fileName) { 
      return;
    }
    var reader = new FileReader();
    reader.readAsText(fileName,'ISO-8859-8');
    reader.onload = file => {
      
      var contents: any = file.target;
      this.text = contents.result;
      //console.log(reader.result.substring(0, 1000));
      //this.st = reader.result;
      //console.log(this.st);
      var readInStrings = reader.result.split('\r\n');
       var pupils = { name: '', lastName:'',ID: Number, missed:0 };
      for(var i=0; i<readInStrings.length; i++){
        if(i%3 == 0)
          pupils.name = readInStrings[i];
  
        else if(i%3 == 1)
          pupils.lastName = readInStrings[i];
        
         else if(i%3 == 2){
          pupils.ID = readInStrings[i];
          this.students.push(pupils);
          this.afService.af.database.list('teams/'+this.team+'/pupils').push(pupils);
          pupils = { name: '', lastName:'',ID: Number, missed:0 };
        }
      }
      
      this.afService.af.database.list('teams/').update(this.team,{name:this.team});
//var info = 
      console.log(this.students);
    };
    
    
   //console.log(reader.readAsText(fileName))b
   //console.log(this.str);

}

  ngOnInit() {
  }

}
//<app-insert></app-insert>