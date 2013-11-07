var socket = io.connect('http://localhost:3000');

//Lors de la connexion avec le serveur, ceci est executé
socket.on('connect', function(){
  //On demande à l'utilisateur son pseudo afin de l'envoyer au serveur
  socket.emit('adduser', prompt("Quel est votre pseudo?"));
});

//Lorsque le serveur envoie des données via 'updatechat', on rafrachit les données affichées à l'utilisateur.
socket.on('updatechat', function (username, data) {
  $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
  $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
});

//Lorsque le serveur envoie un 'updateusers', on raffraichi la liste des utilisateurs affichée à l'utilisateur.
socket.on('updateusers', function(data) {
  $('#users').empty();
  for (var i = 0; i<data.length; i++) {
    $('#users').append('<div>' + data[i] + '</div>');
  };
});

//Lors du chargement de la page (jQuery de base)
$(function(){
  //On fait un focus sur le champ de texte
  $('#data').focus();
  //Lorsque l'on clique sur Envoyer
  $('#datasend').click( function() {
    var message = $('#data').val();
    $('#data').val('');
    //On envoie la commande 'sendchat' avec comme contenu le message
    socket.emit('sendchat', message);
  });

  //Lorsque l'utilisateur appuie sur Enter
  $('#data').keypress(function(e) {
    if(e.which == 13) {
      $(this).blur();
      $('#datasend').focus().click();
      $('#data').focus();
    }
  });
});