import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  firestore: Firestore = inject(Firestore);


  constructor(private router: Router) {
  }

  newGame() {
    let game = new Game();
    let gameAsJson = game.toJson();
    this.addGame(gameAsJson);
  }


  async addGame(item: {}) {
    const gamesDocRef = await addDoc(this.getGamesColRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((gamesDocRef: any) => {
        this.router.navigateByUrl('/game/' + gamesDocRef?.id)
      });
  }


  getGamesColRef() {
    let gamesColRef = collection(this.firestore, 'games');
    return gamesColRef;
  }
}
