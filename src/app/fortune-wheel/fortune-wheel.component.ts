import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fortune-wheel',
  templateUrl: './fortune-wheel.component.html',
  styleUrls: ['./fortune-wheel.component.scss']
})
export class FortuneWheelComponent implements OnInit {
  sectors: { color: string; label: string; }[];
  rand: (m: any, M: any) => any;
  tot: number;
  friction: number;
  EL_spin: any;
  ctx: CanvasRenderingContext2D;
  dia: any;
  rad: number;
  PI: number;
  TAU: number;
  arc: number;
  angVel: number;
  ang: number;

constructor() { }

intiSpinner() {
  this.sectors = [
    {color:"#f82", label:"Bold"},
    {color:"#0bf", label:"10"},
    {color:"#fb0", label:"200"},
    {color:"#0fb", label:"50"},
    {color:"#b0f", label:"100"},
    {color:"#f0b", label:"5"},
    {color:"#bf0", label:"500"},
  ];
  
  this.rand = (m, M) => Math.random() * (M - m) + m;
  this.tot = this.sectors.length;
  this.EL_spin = document.querySelector("#spin");
  this.ctx = (<HTMLCanvasElement>document.querySelector("#wheel")).getContext('2d');
  this.dia = this.ctx.canvas.width;
  this.rad = this.dia / 2;
  this.PI = Math.PI;
  this.TAU = 2 * this.PI;
  this.arc = this.TAU / this.sectors.length;
  
  this.friction = 0.991; // 0.995=soft, 0.99=mid, 0.98=hard
  this.angVel = 0; // Angular velocity
  this.ang = 0; // Angle in radians
}


  
getIndex = () => Math.floor(this.tot - this.ang / this.TAU * this.tot) % this.tot;
  
drawSector(sector, i) {
    const ang = this.arc * i;
    this.ctx.save();
    // COLOR
    this.ctx.beginPath();
    this.ctx.fillStyle = sector.color;
    this.ctx.moveTo(this.rad, this.rad);
    this.ctx.arc(this.rad, this.rad, this.rad, ang, ang + this.arc);
    this.ctx.lineTo(this.rad, this.rad);
    this.ctx.fill();
    // TEXT
    this.ctx.translate(this.rad, this.rad);
    this.ctx.rotate(ang + this.arc / 2);
    this.ctx.textAlign = "right";
    this.ctx.fillStyle = "#fff";
    this.ctx.font = "bold 30px sans-serif";
    this.ctx.fillText(sector.label, this.rad - 10, 10);
    //
    this.ctx.restore();
  };
  
rotate() {
    const sector = this.sectors[this.getIndex()];
    this.ctx.canvas.style.transform = `rotate(${this.ang - this.PI / 2}rad)`;
    this.EL_spin.textContent = !this.angVel ? "PLAY" : sector.label;
    (<HTMLElement>this.EL_spin).style.background = sector.color;
  }
  
frame() {
    if (!this.angVel) return;
    this.angVel *= this.friction; // Decrement velocity by friction
    if (this.angVel < 0.002) this.angVel = 0; // Bring to stop
    this.ang += this.angVel; // Update angle
    this.ang %= this.TAU; // Normalize angle
    this.rotate();
  }
  
engine() {
    this.frame();
    requestAnimationFrame(this.engine.bind(this))
  }
  
 

ngOnInit(): void {
    this.intiSpinner();
     // INIT
    this.sectors.forEach( (sec , i) => {
      this.drawSector(sec, i); 
    });
    this.rotate(); // Initial rotation
    this.engine(); // Start engine
    this.EL_spin.addEventListener("click", () => {
      if (!this.angVel) this.angVel = this.rand(0.25, 0.35);
    })
  }

}
