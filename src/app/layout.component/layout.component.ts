import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth.service/auth.service';

import {
RouterOutlet,
RouterLink,
Router
} from '@angular/router';

@Component({

selector:'app-layout',

standalone:true,

imports:[
RouterOutlet,
RouterLink
],

templateUrl:'./layout.component.html',

styleUrls:['./layout.component.css']

})

export class LayoutComponent implements OnInit {

darkMode=false;

profileImage='https://i.pravatar.cc/100?img=12';

constructor(

private auth:AuthService,
private router:Router

){}

ngOnInit(){

/* Theme load */

const savedTheme =
localStorage.getItem('theme');

if(savedTheme==='dark'){

this.darkMode=true;

document.body.classList.add(
'dark-theme'
);
document.body.classList.remove(
'dark-mode'
);

}

/* Profile image load */

this.profileImage=
localStorage.getItem(
'profileImage'
) ||
'https://i.pravatar.cc/100?img=12';

}

logout(){

this.auth.logout();

this.router.navigate([
'/login'
]);

}

toggleTheme(){

this.darkMode=!this.darkMode;

if(this.darkMode){

document.body.classList.add(
'dark-theme'
);
document.body.classList.remove(
'dark-mode'
);

localStorage.setItem(
'theme',
'dark'
);

}

else{

document.body.classList.remove(
'dark-theme',
'dark-mode'
);

localStorage.setItem(
'theme',
'light'
);

}

}

}
