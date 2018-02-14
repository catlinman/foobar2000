foo_uie_vis_channel_spectrum.dll v0.17.2
for foobar2000 v0.9.5.2+, Columns UI0.1.3 beta1 v7+, WindowsXP+

チャンネルごとのスペクトラム表示component
foo_uie_vis_egohをかなり参考にさせてもらってます。

●設定項目
ForeGround1   バーの色1
ForeGround2   バーの色2(グラデーションかける場合などに使用)
BackGround    背景色
Peak          ピークバーの色
Tics          目盛りの色

Show Peaks    ピークバーの表示

Show tics     目盛りの表示   周波数目盛りと振幅目盛り個別に選択可能。
[ticsの仕様]
  周波数目盛り: 0kHzから2kHz単位に、(通常は)22kHzまで表示されます。
                長い目盛りは、10kHz単位(つまり0kHz,10Hz,20kHz)
  振幅目盛り:   一番上を0dBとして10dB単位で-70dBまで表示されます。
                長い目盛りは、0dB,-20dB,-40dB,-60dB、短い目盛りは、-10dB,-30dB,-50dB,-70dBを示します。
Refresh interval: 描画の更新間隔  msec単位
Range scale:      振幅方向の表示範囲を調整します。
Spacing:          バー間の隙間を設定します。
Padding:          パネル左端右端の余白を調整します。
Logarithm scale:  振幅軸を対数スケールっぽく調整します。(FFT modeが old methodのみ)
                  FFT modeが new methodの場合、振幅軸の下限を-70dBから-80dBに変更します。
Linear scale(frequency) :  周波数軸を線形にします。
Transparent background :   背景透過を行います。
   Fast pseudo-transparent mode : 擬似的だが、高速な背景透過を行います。(背景透過する場合は推奨)

Bar width: バーの幅
Edge style: パネル枠のスタイル
Color Mode: バーの描画スタイルを指定します。
Channel Mode: 各チャンネルのスペクトラムの扱い方を設定します。
              Separate: 各チャンネルのスペクトラムを個別に表示します。
              Merge all: 各チャンネルのスペクトラムをまとめて一つのスペクトラムにして表示します。
              Specified below: 指定の1チャンネルだけ表示します。
FFT size:     フーリエ変換のサイズを設定します。
FFT mode:     フーリエ変換での窓関数のモードを設定します。
              old method: 矩形窓    v0.9.5.1以下互換
              new method: ガウス窓  v0.9.5.2以上のみ
              SDKでは、new methodの使用が推奨されています。
              (他にも変わっているようですが、SDKに書いてないので不明)

Rotate :      回転させたい場合 角度を設定します。
Blur level :  Color ModeでAntialiasingなモードを設定した場合、その強さを設定します。

Bar mode:    バーの表示スタイルを設定します。
Reverse freq-axis:  周波数軸を反転します。
Reverse channel-pos:  チャンネルの表示位置を順序を逆転させます。
                      通常Left-chが左、Right-chが右に表示されますが、それを逆転します。
Sync with scanline:   ディスプレイの更新とアプリケーションの描画の更新が非同期のために起こるちらつき(ティアリング)をある程度抑制します。
                      WindowsXP以前のみ。Vistaでは起きないらしいです。
                      ティアリングが気にならないならoffを推奨します。(DirectX7.0を使用します。)

v0.17.2
・FFT sizeに8192を追加。
・new method選択時に0.9.5.2以上かversionをチェックするようにした。

v0.17.1
・Sync with scanlineがonのときにColumnsUIのレイアウトをいじると落ちる場合があったのを修正。
・FFTのモードがnew methodの場合、Logarithm scaleで振幅の下限を変更できるようにした。

v0.17
・新SDKでコンパイル
・FFTのモードを追加(v0.9.5.2以上)
  窓関数がガウス窓になって波形の形が少し変化(改善？)します。
  new methodの使用が推奨されています。

･compiled with latest foobar2000 SDK 
･added support for new FFT mode (requires foobar v0.9.5.2+)

v0.16
・edgeスタイルがGreyのときの描画方法を変更。


v0.15
・ticsの長さ調整設定 追加。

  tics length setting.


v0.14
・パネルの左端と右端にpadding(スペース入れるだけ)を可能にした
・Separate modeのときのチャンネルの順序と周波数軸の向きの設定を追加

 left/right padding setting.
 configurable channel order and frequancey-axis direction for separate-mode.

v0.13
・振幅軸の目盛り追加[0dB, -70dB].  長い目盛り0,-20,-40,-60dB.  短い目盛り-10,-30,-50,-70dB.
・単純なラインによるスペクラム描画を追加.(Transparent backgroundは非対応)
・背景の色づけを設定を追加.(antialiasingモード以外)
・ディスプレイの走査線に同期するオプションを追加.(ティアリングが発生する環境向け)
・他細かい修正

  一応 下手なりに英訳
  added amplitude-tics[0,-70dB]. (long tics:0,-20,-40,-60dB. short tics:-10,-30,-50,-70dB)
  added simple-line color mode.
  added background color settings.
  added option to synchronize with display scanline. (merge with experimental version for tearing problem)
  other minor changes.
 
v0.12
・周波数軸の線形表示追加 (Linear scale(frequency))。
・周波数軸のスケーリングが微妙にずれる場合があるのを修正。
・設定ダイアログにApply/Import/Export/Resetボタン追加
・設定ダイアログのCancelボタンのキャプション修正。
・通常のForeGround1/2と、
  Verticalのときのadvanced color settingのForeGround1/2を分離した。

v0.11
・Color ModeがVerticalのときの色の設定を増やした。

v0.10.1
・edge styleがNone以外のときの目盛りが1ピクセルしかなくて見えずらいのを修正。  

v0.10
・バー間のスペース量設定可能(Spacing)
・アンチエイリアスの強さ設定可能(Blur level: 0～100)
  色の設定次第だが50ぐらいがいい感じか？

・egohと同様の2kHzごとの目盛り表示(Show tics)
  Peakと同色 あんまりデバッグしてないのであくまで目安。
  たぶん sampling周波数が変わるとおかしくなったり。。。
  1ピクセルぐらいずれてる気もする。
  対数に近いスケーリングの仕方は最初のバージョンからずっと変わってません。
  
v0.09.1
・特定の1チャンネルだけ表示するモードで、
  再生しているファイルにそのチャンネルが存在しない場合、 
  front_leftチャンネルを表示してしまうのを修正  

v0.09
・Horizontal版のアンチエイリアスモードを追加。(Color Mode:Horizontal-antialiasing)
  ただし、背景透過モードを使っているとうまく機能しない。
  Bar modeにしないでの使用がオススメ。
・名前変更 Smooth-> Simple-antialiasing

  ならめか･･･ orz

v0.08
・確保するメモリを減らしたつもり。
・アンチエイリアス風の、ならめかなモードを追加。(Color Mode:Smooth)
  ただし、背景透過モードを使っているとうまく機能しない。

v0.07
・スペクトラムの表示範囲を設定できるようにした。(Range scale default:100  大きくすればバーの高さが低くくなる)
  dBで設定できるようにしたかったが、vis用のFFTが出力する値の詳細が理解できませんでした･･･
  どういう風にスケーリングしてるのやら。。。
・設定ダイアログを調整

v0.06b2
・Pseudo-transparent modeでないTransparent backgroundで、
  バーが消えてしまうことがあるのを修正した(つもり)。

v0.06b
・回転追加(Rotate)
  (作ってみたはいいけど、かなり複雑ですので、仕様からはずしたい気も)
・LとRの表示位置を入れ替える機能追加(Reverse channel pos)
  (180回転したときLチャンネルが右、Rチャンネルが左に表示されるので、
   それを入れ替えたり)
・Pseudo-transparent mode(擬似的だが処理が軽い背景透過モード)で起動時に、
  パネルがほかのウィンドウによって隠されていたりすると
  隠れている部分の背景が 隠しているウィンドウをコピーしてしまうのを修正。

v0.05
・周波数方向の反転追加(Reverse freq-axis)
・チャンネルの合成、1チャンネル表示追加(Channel Mode)

v0.04
・Bar modeを追加
・背景の透過設定を追加(実験的な機能だが) 。
   Pseudo-transparent modeは軽いが、PanelsUIなどでほかのパネルの上に重ねたりできない。
   Pseudo-transparent modeでない場合はきちんと透過させる分だけ相当負荷が高いが、
   一応ほかのパネルの上に重ねられるみたい。

v0.03
・前回終了時にFFT sizeを4096とした状態で起動すると落ちる不具合を修正。
v0.02
・設定項目を増やした。色の設定、FFTサイズ、更新間隔など。
   FFT sizeを増やすと、周波数分解能が上がる(と思う)
   ただし、時間方向の分解能が下がる(波形の変化がなめらかになる)

   負荷が高い場合は、  表示領域を小さくしたり、
   FFT sizeを下げたり、Refresh intervalを上げると負荷が減るはず。
      
・中心が突出しやすいので低周波成分を一部表示させていなかったところを
  考え直して表示させるように修正。
・処理速度を上げたつもり。
