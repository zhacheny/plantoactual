Template.upload.onCreated( () => {
  Template.instance().uploading = new ReactiveVar( false );
});

Template.upload.helpers({
  uploading() {
    return Template.instance().uploading.get();
  }
});
Template.upload.events({
	'change [name="operator"]' ( event, template ) {
	    template.uploading.set( true );

	    Papa.parse( event.target.files[0], {
	      header: true,
	      complete( results, file ) {
	        Meteor.call( 'parseUpload_operator', results.data, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	            template.uploading.set( false );
	          } else {
	            template.uploading.set( false );
	            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
	          }
	        });
	      }
	    });
	  },
  	'change [name="part"]' ( event, template ) {
	    template.uploading.set( true );

	    Papa.parse( event.target.files[0], {
	      header: true,
	      complete( results, file ) {
	        Meteor.call( 'parseUpload_part', results.data, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	            template.uploading.set( false );
	          } else {
	            template.uploading.set( false );
	            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
	          }
	        });
	      }
	    });
	  },

	// 'change [name="uploadCSV"]' ( event, template ) {
	//     template.uploading.set( true );
	//     var data = event.target.files[0];
	// 	var config = {
	// 		delimiter: "",	// auto-detect
	// 		newline: "",	// auto-detect
	// 	};
	// 	Papa.parse(data, {
	//       header: true,
	//       complete( results, file ) {
	//         // Handle the upload here.
	//         var data = results.data;	        
	//         for ( let i = 0; i < 1; i++ ) {
 //      			let item   = data[ i ]
	// 			let part   = data[ i ]['Assembly No'];
	// 			let cell   = data[ i ]['Work'];
	// 			let buildingnumber   = data[ i ]['buildingnumber'];
	// 			let ProductCode   = data[ i ]['Prod'];
	// 			let MinutesPP_one  = data[ i ]['1 Operator Minutes'];
	// 			let MinutesPP_two   = data[ i ]['2 Operator Minutes'];
	// 			let MinutesPP_three   = data[ i ]['3 Operator Minutes'];
	// 			let XMLname   = data[ i ]['Link'];
	// 			let PiecesPH_one  = MinutesPP_one ==''? '': '' + MinutesPP_one*60;
	// 			let PiecesPH_two   = MinutesPP_two ==''? '':'' + MinutesPP_two*60;
	// 			let PiecesPH_three = MinutesPP_three ==''? '':'' + MinutesPP_three*60;
	// 			Meteor.call('inserttest',part,cell,buildingnumber,XMLname,ProductCode,MinutesPP_one,
	// 	MinutesPP_two,MinutesPP_three,PiecesPH_one,PiecesPH_two,PiecesPH_three)
 //    //   			console.log(MinutesPP_one);
 //    //   			console.log(PiecesPH_one);
 //    //   			console.log(typeof(MinutesPP_two));
 //    //   			console.log(PiecesPH_two);

	// 			// console.log(typeof(MinutesPP_three));
	// 			// console.log(PiecesPH_three);

 //      		}
	//       }
	//     });
	//   }
});