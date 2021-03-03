$(window).load(function() {

	$('#enter').click(function(){

		var endpoint = "https://query.wikidata.org/sparql";

		const age = document.form2.age;
		//値を取得
		const text = age.selectedIndex;
		//値(数値)から値(value)を取得
		const str = age.options[text].value;

		
		const limit = document.form3.limit;
		//値を取得
		const num = limit.selectedIndex;
		//値(数値)から値(value)を取得
		const x = limit.options[num].value;

		var random1 = Math.round( Math.random()*10 );
        if(random1==0){
            random1="";
        }else if(random1==1){
            random1=" OFFSET 100";
        }else if(random1==2){
            random1=" OFFSET 200";
        }else if(random1==3){
            random1=" OFFSET 300";
        }else if(random1==4){
            random1=" OFFSET 400";
        }else if(random1==5){
            random1=" OFFSET 500";
        }else if(random1==6){
            random1=" OFFSET 600";
        }else if(random1==7){
            random1=" OFFSET 700";
        }else if(random1==8){
            random1=" OFFSET 800";
        }else if(random1==9){
            random1=" OFFSET 900";
        }else if(random1==10){
            random1=" OFFSET 1000";
        }

		input_message = "SELECT DISTINCT ?名前 ?生年月日 ?ふりがな ?a\n" +
        "WHERE\n" +
        "{\n" +
        "  ?id wdt:P31 wd:Q5;\n" +
        "      wdt:P19/wdt:P17 wd:Q17;\n" +
        "      wdt:P1559 ?名前;\n" +
        "  OPTIONAL{?id wdt:P1814 ?ふりがな.}\n" +
        "  OPTIONAL{?id wdt:P569 ?生年月日.}\n" +
        "  OPTIONAL{?id wdt:P18 ?pic.}\n" +
        "  \n" +
        "  "+str+" rdfs:label ?age;\n" +
        "             wdt:P580 ?start_time;\n" +
        "             wdt:P582 ?end_time.\n" +
        "   FILTER(LANG(?age)='ja')\n" +
        "  \n" +
        "  FILTER(?start_time <= ?生年月日 && ?生年月日 <= ?end_time)\n" +
        "  FILTER(LANG(?名前)='ja')\n" +
        "  \n" +
        "}\n" +
        "ORDER BY (?生年月日)\n" +
		"LIMIT "+x+"\n" +
		""+random1+"\n" +
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
					for ( var key in data[0]) {
						var th = document.createElement('th');
						var label = key;
						th.innerHTML = key;
						headerRow.appendChild(th);
					}
				}

				var i = 0;
				for ( var key in data[d]) { //長さd
					var cell = row1.insertCell(i++); // ２つ目以降のセルを追加
					var value = data[d][key]; //0-a 0-bなど上の
					if (value.value != undefined){
						value = value.value;
					}
					if (value == null) {
						value = '';
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
