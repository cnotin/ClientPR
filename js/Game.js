var DIMENSION_BALLE = 5;

/**
 * Gère le jeu, les mécaniques de jeu et la « boucle principale »
 * du jeu.
 * @see Network.js
 * @see Rectangle.js
 * @see Ball.js
 * @see Scene.js
 * @see Slider.js
 */
function Game() {

  /*
   * Ajoute un joueur au tableau de joueurs.
   * 
   * Cette méthode est appelée lors de la réception d'un GStat.
   * Si un nouveau joueur est présent, on le rajoute.
   * 
   * @param tabJoueursArg Le tableau des joueurs inclus dans 
   * le message du serveur.
   */
  this.setJoueurs = function(tabJoueursArg)
  {
    console.log("Fonction setJoueurs appelée.");
    
    // Verifie s'il y a un nouveau joueur
    if (this.tabJoueurs.length != tabJoueursArg.players.length)
    {
        var i=0;
        for (i=0; i < tabJoueursArg.players.length; i++)
        {
            if (!this.tabJoueurs[tabJoueursArg.players[i]])
            {   // On cree le nouveau joueur
                // On regarde la valeur de axe dans tabJoueurs pour voir ou positionner la raquette
                                this.calculAncreJoueur(tabJoueursArg[i],this.tabJoueursArg.players[i].axe);
            }
        }
    }
    //this.tabJoueurs = tabJoueursArg;
  };

  /*
  Calcule la position des ancres de la raquette d'un joueur en fonction de l'axe donne par le serveur.
  Ajoute ensuite le joueur a la liste des joueurs.
  Exemple : Si l'axe est de 0, alors la raquette sera a gauche.
  Si l'axe est de 1, alors la raquette sera a droite.	
  */
  this.calculAncreJoueur = function(nom,axe)
  {
      var ancreDepart = {x:0, y:0};
      var ancreArrivee = {x:0, y:0};
      if (axe === 0)
      {
          // Raquette a gauche
          ancreDepart.x = 0.01*this.scene.getWidth();
          ancreDepart.y = 0.3*this.scene.getHeight();
          ancreArrivee.x = ancreDepart.x;
          ancreArrivee.y = this.scene.getHeight() - ancreDepart.y;
          this.addJoueur(nom,ancreDepart,ancreArrivee,50);	
      }
      else if (axe === 1)
      {
            // Raquette a droite
            ancreDepart.x = 0.99*this.scene.getWidth()-7;
            ancreDepart.y = 0.3*this.scene.getHeight();
            ancreArrivee.x = ancreDepart.x;
            ancreArrivee.y = this.scene.getHeight() - ancreDepart.y;
            this.addJoueur(nom,ancreDepart,ancreArrivee,50);
      }
  };

    // Ajoute un joueur
  this.addJoueur = function(nom, ancre1, ancre2, pos)
  {
    var sliderJ = new Slider(ancre1.x, ancre1.y, ancre2.x, ancre2.y);
    this.scene.add('S'+nom, sliderJ);
    this.tabJoueurs[nom] = {ancreDep : ancre1,
                ancreArr : ancre2,
                position : pos,
                slider: sliderJ};	    
  };

  // Supprime un joueur
  this.supprJoueur = function(nom)
  {
    delete(this.tabJoueurs.nom);
  };

    
  this.calculPositionBalle = function(posX,posY,collisionTime)
  {
    //alert(collisionTime-this.ancienTime);
    //this.ancienTime = collisionTime;
      
    this.setBall(posX,posY);
    
    /*
    d = new Date();
    
    // Le temps qu'il nous reste avant la collision est egal au temps de collision - le temps courant
    //alert("Collision Time : " + collisionTime + "   Temps Courant : " + d.getTime());
    var difference = collisionTime - d.getTime();
    
    // Nombre de points a calculer
    var nombrePoints = difference;///2; //- 5;
    
    // Calcul du tableau de points
    this.calculPositionsBalle(posX,posY,nombrePoints);
    
    
    // Affichage toutes les 2 ms de setBall
    /*for (i = 0; i < nombrePoints*2; i++)
    {
        // On affiche la balle
        alert("X : " + this.tabPosBalle[i].x + "    Y : " + this.tabPosBalle[i].y)
        this.setBall(this.tabPosBalle[i].x, this.tabPosBalle[i].y);
        
    }
    */
  };

  function coordonneesPoint(x,y)
  {
    this.x = x;
    this.y = y;
  }

  this.calculPositionsBalle = function(posX,posY,nbrPoints)
  {
    // Tableau de position des points
    this.tabPosBalle = new Array;
    
    // Calcul du vecteur allant du point courant de la balle vers le point de collision
    var vecteurX = posX - this.Gball.x;
    var vecteurY = posY - this.Gball.y;
    
    // Division de vecteurX et de vecteurY par le nombre de points
    var xAjout = vecteurX / nbrPoints;
    var yAjout = vecteurY / nbrPoints;
    
    // Sauvegarde des points courants de la balle
    var xCourant = this.Gball.x;
    var yCourant = this.Gball.y;
    
    // Stockage des points calcules dans le tableau
    for (i=0; i < nbrPoints*2; i++)
    {
      xCourant = xCourant + xAjout;
      yCourant = yCourant + yAjout;
      //var point = new coordonneesPoint(xCourant,yCourant);
      
      // On enregistre le point
      //this.tabPosBalle[i] = point;
      //alert("X : " + xCourant + "    Y : " + yCourant)
      this.setBall(xCourant,yCourant);
    }
  };


  this.refreshGame = function ()
  {
        this.scene.clear();   
  };

  /*
  Calcule la position de la balle, efface la scene, et redessine la balle
  */
  this.setBall = function(posX, posY)
  {
    this.Gball.x = (posX * this.scene.getWidth())/100;
    this.Gball.y = (posY * this.scene.getHeight())/100;
              
    // Display of the ball
    this.scene.clear();
    this.scene.drawAll();
  };


  this.moveSlider = function(slider, pos){	
    console.log('Avant : ' +slider.a.y + ' ' + pos + ' ' + slider.l);
    
    ay = (pos/100) * this.scene.getHeight() - (slider.l/2);
    
    if (ay > 0 && (ay + slider.l) < this.scene.getHeight())
    {
        slider.a.y = ay;
        //TODO : Change name !!
        this.tabJoueurs['Thomas'].position = pos;    
        this.nw.sendBouge(pos);
    }
    
    console.log('apres : ' +slider.a.y);
    this.scene.clear();
    this.scene.drawAll();
  };
    
  this.moveSliderServer = function(slider, pos){	
    ay = (pos/100) * this.scene.getHeight() - (slider.l/2);
    
    if (ay > 0 && (ay + slider.l) < this.scene.getHeight())
    {
        slider.a.y = ay;
        //TODO : Change name !!
        this.tabJoueurs['Thomas'].position = pos;    
    }
    
    this.scene.clear();
    this.scene.drawAll();
  };
  
  this.connect = function()
  {
      this.nw.sendHello("Thomas");
  };
   
	
  this.game = function()
  {
      // Joueurs
      this.tabJoueurs = new Array(1);	            // A CHANGER       
      
      this.ancienTime = 0;

      this.nw = new Network(this);
      this.scene = new Scene();
      this.scene.attachCanvas("GameZone");

      // Creation de la balle
      this.balle = { x : 50, y : 50, dX : 0, dY : 0};
      if(!this.Gball) {
        this.Gball = new Ball(DIMENSION_BALLE, this.balle.x, this.balle.y, true);
      }

      // On ajoute la balle a la scene
      this.scene.add("Balle",this.Gball);
      
      // Ajout d'un joueur
      this.calculAncreJoueur("Thomas",0);  // A gauche
      this.calculAncreJoueur("Mathieu",1);

      // Connection au Serveur
      this.nw.connect();
    
      setTimeout(function() {}, 1000); 
      // Envoi du message Hello : connexion d'un nouveau joueur


      /*this.ancres = new Array;       // Ancres des slides
      this.createSlides();    // On cree les slides en fonction des joueurs
      this.setSlides();       // On les dessine*/
      

      if(this.Gpongzone) {
        this.Gpongzone = PongZone(this.ancres);
      }
    
      // On dessine tout
      this.scene.drawAll();
  };
}	