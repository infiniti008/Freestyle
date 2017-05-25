Set oVoice = CreateObject("SAPI.SpVoice")
set oSpFileStream = CreateObject("SAPI.SpFileStream")
oSpFileStream.Open "D:\Install\console\Programm\freestyle\prokrut\electron\alarm\mus\serena.wav"
oVoice.SpeakStream oSpFileStream
oSpFileStream.Close