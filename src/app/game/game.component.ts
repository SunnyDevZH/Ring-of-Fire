import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { GameData } from '../interfaces/game-data.interface';
import { ActivatedRoute } from '@angular/router';
import { PlayerMobileComponent } from '../player-mobile/player-mobile.component';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, MatDialogModule, MatInputModule, FormsModule, GameInfoComponent, PlayerMobileComponent, EditPlayerComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  game: Game | any;
  gameId: string | undefined | any;
  unsubGames;
  gameOver = false;

  firestore: Firestore = inject(Firestore);


  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
    });
    this.unsubGames = this.subGamesList(this.gameId);
  }

  ngOnInit(): void {
  }


  newGame() {
    this.game = new Game();
  }


  setGameObject(): GameData {
    return this.game.toJson();
  }


  subGamesList(colId: string) {
    return onSnapshot(doc(this.firestore, 'games', colId), (document: any) => {
      (this.game.currentPlayer = document.data().currentPlayer),
        (this.game.stack = document.data().stack),
        (this.game.players = document.data().players),
        (this.game.player_images = document.data().player_images),
        (this.game.playedCards = document.data().playedCards),
        (this.game.pickCardAnimation = document.data().pickCardAnimation),
        (this.game.currentCard = document.data().currentCard)
    });
  }


  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop();
      this.game.pickCardAnimation = true;
      this.nextPlayer();
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }


  nextPlayer() {
    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
  }


  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);

    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('player_male.png');
        this.saveGame();
      }
    });
  }


  async saveGame() {
    const docRef = doc(this.firestore, "games", this.gameId);
    await updateDoc(docRef, this.game.toJson());
  }


  ngonDestroy() {
    this.unsubGames();
  }
}
