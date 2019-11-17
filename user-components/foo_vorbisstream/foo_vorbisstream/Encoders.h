#pragma once 

#include <afxwin.h>
#include "resource.h"
#include "Edcast.h"

#include "../SDK/foobar2000.h"

class dsp_vstream;

class stream_encoder {
public:
	stream_encoder();
	~stream_encoder();
	void connect();
	void disconnect();
	void reconnect();

	void handle_chunk(audio_chunk*);
	bool can_attach(const dsp_preset&);
	void detach();
	void set_config(const dsp_preset&);
	bool ready_to_stream();
	unsigned get_sample_rate() const {return config->currentSamplerate;}

//	int reconnect_wait;
//	time_t connect_time;
//	int index;

	edcastGlobals*config;
	dsp_vstream*attached;
};

class stream_encoders {
public:
	stream_encoders();
	~stream_encoders();

	void update_metadata(const file_info&);
	void update_metadata(metadb_handle_ptr);

	stream_encoder* attach(const dsp_preset&,dsp_vstream*);
	void purge_detached();

	void connect();
	void disconnect();
	void reconnect();

	bool connected;
	UINT_PTR reconnect_timer;

	void handle_chunk(audio_chunk*);

	pfc::list_t<stream_encoder*>enc_list;
	pfc::list_t<pfc::string>metadata;

	CWinApp	main_app;
private:
};