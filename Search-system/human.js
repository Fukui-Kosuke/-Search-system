$(window).load(function() {

	$('#enter').click(function(){

		var endpoint = "https://query.wikidata.org/sparql";

		//テキストボックスの内容をクエリに組み込み
		var input_message = document.getElementById("input_message").value;

		input_message = "SELECT DISTINCT ?名前 ?出身国 ?県名 ?生年月日 ?死亡日 ?死地 ?配偶者 ?画像 \n" +
        "WHERE\n" +
        "{\n" +
        "  BIND(\""+input_message+"\"@ja as ?名前).\n" +
        "  ?id rdfs:label ?名前;\n" +
        "      wdt:P19/wdt:P17/wdt:P1705 ?出身国.\n" +
        "  OPTIONAL{?id wdt:P19/wdt:P131/wdt:P131/wdt:P1705 ?県名}\n" +
        "  OPTIONAL{?id wdt:P569 ?生年月日}\n" +
        "  OPTIONAL{?id wdt:P570 ?死亡日}\n" +
        "  OPTIONAL{?id wdt:P26 ?spouse}\n" +
        "  OPTIONAL{?id wdt:P18 ?画像}\n" +
        "  OPTIONAL{?id wdt:P20 ?point}\n" +
        "\n" +
        "  ?point rdfs:label ?死地.\n" +
        "  FILTER(LANG(?死地)='ja')\n" +
        "  ?spouse rdfs:label ?配偶者.\n" +
        "  FILTER(LANG(?配偶者)='ja')\n" +
        "\n" +
        "}\n" +
        "ORDER BY (?date)\n" +
        "LIMIT 10\n" +
        "";

	//上のクエリを成形
	qr = sendQuery(
		endpoint
		,input_message.replace(/[\n\r]/g,"")
	);
	qr.fail(
		function (xhr, textStatus, thrownError) {
			alert("Error: A '" + textStatus+ "' occurred.");
		}
	);
	qr.done(
		function (d) {
			result_table(d.results.bindings);
		}
	);

	});

	$('#result_div').hide();

	});

//テーブルの関数
	function result_table(data){
		var result_div = $('#result_div');

		var table = $('#result_list')[0];

		if (table == undefined) {
			result_div.append($('<table border="1"></table>').attr({
				'id' : 'result_list',
				'class' : 'table'
			}));
			table = $('#result_list')[0];
		}

		while (table.rows.length > 0) {
			table.deleteRow(0); // 行を追加
		}

		if (data instanceof Array) {
			result_div.show();
			// ヘッダ
			var header = table.createTHead(); // 行を追加
			var headerRow = header.insertRow(0);

			id = 1;
			for (var d = 0; d < data.length; d++) {
				var row1 = table.insertRow(d + 1); // 行を追加

				if (d == 0) {
					for ( var key in data[0]) {//s p oが順に入る
						var th = document.createElement('th');
						var label = key;
						th.innerHTML = key;
						headerRow.appendChild(th);//ヘッダーに入る
					}
				}

				//結果のセル
				var i = 0;
				for ( var key in data[d]) {
					var cell = row1.insertCell(i++); // ２つ目以降のセルを追加
					var value = data[d][key];
					if (value.value != undefined){
						value = value.value;
					}
					if (value == null) {
						value = '';
					}

					if ( value.match(/.jpg/)||value.match(/.png/)) {
					console.log(value);
					//strにhogeを含む場合の処理
					value = '<img src ="'+value+'" height = "300">'
					} 
					
					var link = true;
					if (link) {
						if (value != null && value.indexOf("http://") == 0) {
							value = '<a href="'+value+'" target="_blank">'
									+ value + '</a>';
						}
					}
					cell.innerHTML = value;
				}
			}
		}
	};
