import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-player',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent {
  allProfilePictures = ['player_male.png', 'player_female.png', 'player_monkey.png', 'player_penguin.png', 'player_headphones.png', 'player_dino.png'];


  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<EditPlayerComponent>) {

  }
}
