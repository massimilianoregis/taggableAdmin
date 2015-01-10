function get_exif_data(image_result)
		{
	debugger;
			var data = image_result.replace("data:image/jpeg;base64,", "");
			var decoded_data = btoa(data);
			
			getLongAt = function(iOffset, bBigEndian) {
						var iByte1 = decoded_data.charCodeAt(iOffset),
							iByte2 = decoded_data.charCodeAt(iOffset + 1),
							iByte3 = decoded_data.charCodeAt(iOffset + 2),
							iByte4 = decoded_data.charCodeAt(iOffset + 3);

						var iLong = bBigEndian ? 
							(((((iByte1 << 8) + iByte2) << 8) + iByte3) << 8) + iByte4
							: (((((iByte4 << 8) + iByte3) << 8) + iByte2) << 8) + iByte1;
						if (iLong < 0) iLong += 4294967296;
						return iLong;
					};
			
			getSLongAt = function(iOffset, bBigEndian) {
				var iULong = getLongAt(iOffset, bBigEndian);
				if (iULong > 2147483647)
					return iULong - 4294967296;
				else
					return iULong;
			};
			
			var result = findEXIFinJPEG({ 
				getByteAt: function(idx) { return decoded_data.charCodeAt(idx); },
				getLength: function() { return decoded_data.length; },
				getShortAt: function(iOffset, bBigEndian) {
						var iShort = bBigEndian ? 
							(decoded_data.charCodeAt(iOffset) << 8) + decoded_data.charCodeAt(iOffset + 1)
							: (decoded_data.charCodeAt(iOffset + 1) << 8) + decoded_data.charCodeAt(iOffset)
						if (iShort < 0) iShort += 65536;
						return iShort;
					},
				getStringAt: function(a, b) { return decoded_data.substring(a, a+b); },
				getLongAt: getLongAt,
				getSLongAt: getSLongAt
			});
			return result;
		}
	
		var holder = document.getElementById('holder'),
			state = document.getElementById('status');

		if (typeof window.FileReader === 'undefined') {
		  state.className = 'fail';
		} else {
		  state.className = 'success';
		  state.innerHTML = 'A';
		}
		
		holder.ondragover = function () { this.className = 'hover'; return false; };
		holder.ondragend = function () { this.className = ''; return false; };
		holder.ondrop = function (e) {
		  this.className = '';
		  e.preventDefault();

		  var file = e.dataTransfer.files[0],
			  reader = new FileReader();
		  reader.onload = function (event) {
			exif_data = get_exif_data(event.target.result);
			
			for(var idx in exif_data)
			{
				var div = $("<tr />");
				div.append($("<td class=\"property\" />").text(idx));
				div.append($("<td class=\"value\" />").text(exif_data[idx]));
				$("#result").append(div);
			}
		  };
		  reader.readAsDataURL(file);

		  return false;
		};
		
		var keyStr = "ABCDEFGHIJKLMNOP" +
               "QRSTUVWXYZabcdef" +
               "ghijklmnopqrstuv" +
               "wxyz0123456789+/" +
               "=";
			   
		function decode64(input) {
			 var output = "";
			 var chr1, chr2, chr3 = "";
			 var enc1, enc2, enc3, enc4 = "";
			 var i = 0;

			 // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
			 var base64test = /[^A-Za-z0-9\+\/\=]/g;
			 if (base64test.exec(input)) {
				alert("There were invalid base64 characters in the input text.\n" +
					  "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
					  "Expect errors in decoding.");
			 }
			 input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

			 do {
				enc1 = keyStr.indexOf(input.charAt(i++));
				enc2 = keyStr.indexOf(input.charAt(i++));
				enc3 = keyStr.indexOf(input.charAt(i++));
				enc4 = keyStr.indexOf(input.charAt(i++));

				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;

				output = output + String.fromCharCode(chr1);

				if (enc3 != 64) {
				   output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64) {
				   output = output + String.fromCharCode(chr3);
				}

				chr1 = chr2 = chr3 = "";
				enc1 = enc2 = enc3 = enc4 = "";

			 } while (i < input.length);

			 return unescape(output);
		  }