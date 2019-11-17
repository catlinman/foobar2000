#include "Encoders.h"
#include "Edcast.h"
#include "Config.h"

extern pfc::counter dsp_instances;

static VOID CALLBACK _reconnect(HWND hwnd, UINT uMsg, UINT idEvent, DWORD dwTime){
	encoders.reconnect();
}

stream_encoders::stream_encoders(){}

void stream_encoders::update_metadata(const file_info&p_info){
	metadata.remove_all();

	pfc::string artist,title;
    for (unsigned i=0;i<p_info.meta_get_count();i++) {
		pfc::string name = p_info.meta_enum_name(i);
		for (unsigned j=0;j<p_info.meta_enum_value_count(i);j++){
			pfc::string value = p_info.meta_enum_value(i,j);
			pfc::string buffer=name+"="+value;
			metadata.add_item(buffer);

			if(pfc::string::g_equalsCaseInsensitive(name,"artist"))
				artist=value;
			if(pfc::string::g_equalsCaseInsensitive(name,"title"))
				title=value;
		}
    }

	pfc::string meta=artist+" - "+title;
	for(unsigned i=0;i<enc_list.get_count();++i){
		strcpy(enc_list[i]->config->gSongTitle,(char*)meta.ptr());
		enc_list[i]->config->ice2songChange=true;
		updateSongTitle(enc_list[i]->config,0);
	}
}

void stream_encoders::update_metadata(metadb_handle_ptr p_track){
    if(p_track!=0){
        p_track->metadb_lock();
		const file_info*p_info;
        if(p_track->get_info_async_locked(p_info))
			update_metadata(*p_info);
		p_track->metadb_unlock();
    }
}

void stream_encoder::handle_chunk(audio_chunk*p_chunk){
	handle_output(config,
		(float*)p_chunk->get_data(),
		p_chunk->get_sample_count(),
		p_chunk->get_channels(),
		p_chunk->get_srate());
}

void stream_encoders::handle_chunk(audio_chunk*p_chunk){
	for(unsigned i=0;i<enc_list.get_count();++i)
		enc_list[i]->handle_chunk(p_chunk);
}

void stream_encoder::connect(){
	if((!config->weareconnected)&&(ready_to_stream())){
		setForceStop(config, 0);
		if(connectToServer(config) == 0)
			config->forcedDisconnect = true;
	}
}

void stream_encoders::connect(){
	if(!connected) {
		if(reconnect_timer)
			KillTimer(0,reconnect_timer);
		connected = true;
		for(unsigned i=0;i<enc_list.get_count();++i)
			enc_list[i]->connect();
		reconnect_timer = SetTimer(0,0,1000,(TIMERPROC) _reconnect);
	}
}

void stream_encoders::reconnect(){
	for(unsigned i=0;i<enc_list.get_count();i++)
		enc_list[i]->reconnect();
}

void stream_encoder::reconnect(){
	if(config->forcedDisconnect) {
		config->forcedDisconnect = false;
		connect();
	}
}
void stream_encoder::disconnect(){
	setForceStop(config, 1);
	disconnectFromServer(config);
	config->forcedDisconnect = false;
}

void stream_encoders::disconnect(){
	if(connected){
		KillTimer(0,reconnect_timer);
		reconnect_timer=0;
		connected = false;
		for(unsigned i=0;i<enc_list.get_count();++i)
			enc_list[i]->disconnect();
	}
}

stream_encoders::~stream_encoders(){
	disconnect();
	for(unsigned i=0;i<enc_list.get_count();++i){
		delete enc_list[i];
	}
}

bool stream_encoder::can_attach(const dsp_preset&p_data){
	edcastGlobals*cfg=(edcastGlobals*)p_data.get_data();
	bool hax=true;
	hax&=!strcmp(config->gMountpoint,cfg->gMountpoint);
	hax&=!strcmp(config->gPassword,cfg->gPassword);
	hax&=!strcmp(config->gServer,cfg->gServer);
	hax&=!strcmp(config->gPort,cfg->gPort);
	return hax;	
}

stream_encoder::stream_encoder() {
	config=new edcastGlobals;
	initializeGlobals(config);
}
stream_encoder::~stream_encoder() {
	delete config;
}

stream_encoder* stream_encoders::attach(const dsp_preset&p_data,dsp_vstream*dsp){
	//we might just need a detached encoder.
	for(unsigned i=0;i<enc_list.get_count();++i)
		if(enc_list[i]->can_attach(p_data)){
 			enc_list[i]->attached=dsp;
			return enc_list[i];
		}
	
	//otherwise, we gotta make a new encoder

	stream_encoder* next=new stream_encoder();
	enc_list.add_item(next);
	next->set_config(p_data);	
	next->connect();
	next->attached = dsp;
	purge_detached();
	return next;
}

void stream_encoder::set_config(const dsp_preset&p_data){
	edcastGlobals*cfg=(edcastGlobals*)p_data.get_data();
		
	config->currentBitrate=cfg->currentBitrate;
	config->currentSamplerate=cfg->currentSamplerate;
	config->currentChannels=cfg->currentChannels;
	config->currentSamplerate=cfg->currentSamplerate;
	config->gOggBitQualFlag=cfg->gOggBitQualFlag;
	config->gReconnectSec=cfg->gReconnectSec;
	config->gShoutcastFlag=cfg->gShoutcastFlag;
	config->gIcecast2Flag=cfg->gIcecast2Flag;
	config->gPubServ=cfg->gPubServ;
	strcpy(config->gEncodeType,cfg->gEncodeType);
	strcpy(config->gOggQuality,cfg->gOggQuality);
	strcpy(config->gMountpoint,cfg->gMountpoint);
	strcpy(config->gPassword,cfg->gPassword);
	strcpy(config->gServer, cfg->gServer);
	strcpy(config->gPort, cfg->gPort);
	strcpy(config->gServerType,cfg->gServerType);
	strcpy(config->gServDesc,cfg->gServDesc);
	strcpy(config->gServName,cfg->gServName);
	strcpy(config->gServGenre,cfg->gServGenre);
	strcpy(config->gServURL,cfg->gServURL);
	strcpy(config->gServAIM,cfg->gServAIM);
	strcpy(config->gServICQ,cfg->gServICQ);
	strcpy(config->gServIRC,cfg->gServIRC);
//	disconnect();
//	connect();
}

void stream_encoder::detach(){
	attached=0;
}

void stream_encoders::purge_detached(){
	if(enc_list.get_count()>(unsigned)dsp_instances)
		for(unsigned i=0;i<enc_list.get_count();++i)
			if(!enc_list[i]->attached){
				delete enc_list[i];
				enc_list.remove_by_idx(i);
				purge_detached();	//recursive call to ensure that at most 1 stream_encoder gets deleted per length check, just as some added paranoia
				break;
			}
}

bool stream_encoder::ready_to_stream(){
	return 
		strcmp(config->gServer,"")!=0 &&
		atoi(config->gPort)>0 &&
		strcmp(config->gMountpoint,"")!=0 &&
		strcmp(config->gPassword,"")!=0 &&
		config->currentChannels>0 &&
		config->currentSamplerate>0;
}