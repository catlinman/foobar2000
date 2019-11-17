#ifndef __DSP_EDCAST_H
#define __DSP_EDCAST_H

#include "Socket.h"
#include <vorbis/vorbisenc.h>
#include <stdio.h>
#include <time.h>

#include "../sdk/foobar2000.h"

class stream_encoders;
extern stream_encoders encoders;

#ifdef _DMALLOC_
#include <dmalloc.h>
#endif

#define char_t char

#define LM_FORCE 0
#define LM_ERROR 1
#define LM_INFO 2
#define LM_DEBUG 3
#define LOG_FORCE LM_FORCE, __FILE__, __LINE__
#define LOG_ERROR LM_ERROR, __FILE__, __LINE__
#define LOG_INFO LM_INFO, __FILE__, __LINE__
#define LOG_DEBUG LM_DEBUG, __FILE__, __LINE__

#define FormatID 'fmt '   /* chunkID for Format Chunk. NOTE: There is a space at the end of this ID. */
// For skin stuff
#define WINDOW_WIDTH		276
#define WINDOW_HEIGHT		150

#ifndef FALSE
#define FALSE false
#endif

#ifndef TRUE
#define TRUE true
#endif

#include <mmsystem.h>

// Callbacks
#define	BYTES_PER_SECOND 1

typedef struct {
	char_t	RIFF[4];
	long	chunkSize;
	char_t	WAVE[4];
} RIFFChunk;

typedef struct {
  char_t		chunkID[4];
  long		chunkSize;

  short          wFormatTag;
  unsigned short wChannels;
  unsigned long  dwSamplesPerSec;
  unsigned long  dwAvgBytesPerSec;
  unsigned short wBlockAlign;
  unsigned short wBitsPerSample;

/* Note: there may be additional fields here, depending upon wFormatTag. */

} FormatChunk;


typedef struct {
	char_t	chunkID[4];
	long	chunkSize;
	short *	waveformData;
} DataChunk;

struct wavhead
{
	unsigned int  main_chunk;
	unsigned int  length;
	unsigned int  chunk_type;
	unsigned int  sub_chunk;
	unsigned int  sc_len;
	unsigned short  format;
	unsigned short  modus;
	unsigned int  sample_fq;
	unsigned int  byte_p_sec;
	unsigned short  byte_p_spl;
	unsigned short  bit_p_spl;
	unsigned int  data_chunk;
	unsigned int  data_length;
};


static struct wavhead   wav_header;

// Global variables....gotta love em...
struct edcastGlobals {
	edcastGlobals() {memset(this, 0, sizeof(*this));}
	~edcastGlobals() {}
	long		currentSamplerate;
	int		currentBitrate;
	int		currentBitrateMin;
	int		currentBitrateMax;
	int		currentChannels;
	int		gSCSocket;
	int		gSCSocket2;
	int		gSCSocketControl;
	CMySocket	dataChannel;
	CMySocket	controlChannel;
	int		gSCFlag;
	int		gCountdown;
	int		gAutoCountdown;
	int		automaticconnect;
	char_t		gSourceURL[1024];
	char_t		gServer[256];
	char_t		gPort[10];
	char_t		gPassword[256];
	int		weareconnected;
	char_t		gIniFile[1024];
	char_t		gAppName[256];
	char_t		gCurrentSong[1024];
	int			gSongUpdateCounter;
	char_t		gMetadataUpdate[10];
	int			gPubServ;
	char_t		gServIRC[20];
	char_t		gServICQ[20];
	char_t		gServAIM[20];
	char_t		gServURL[1024];
	char_t		gServDesc[1024];
	char_t		gServName[1024];
	char_t		gServGenre[100];
	char_t		gMountpoint[100];
	char_t		gFrequency[10];
	char_t		gChannels[10];
	int			gAutoReconnect;
	int 		gReconnectSec;
	char_t		gAutoStart[10];
	char_t		gAutoStartSec[20];
	char_t		gQuality[5];

	int		gCurrentlyEncoding;
	char_t		gIceFlag[10];
	char_t		gOggQuality[25];
	
	int		gOggBitQualFlag;
	char_t	gOggBitQual[40];
	char_t	gEncodeType[25];
	int		gAdvancedRecording;
	int		gNOggchannels;
	char_t		gModes[4][255];
	int		gShoutcastFlag;
	int		gIcecastFlag;
	int		gIcecast2Flag;

	int		oggflag;
	int		serialno;

	ogg_sync_state  oy_stream;
	ogg_packet header_main_save;
	ogg_packet header_comments_save;
	ogg_packet header_codebooks_save;

	bool		ice2songChange;
	int			in_header;
	long		 written;

	char_t    gSongTitle[1024];
	char_t    gManualSongTitle[1024];
	int		gLockSongTitle;
    int     gNumEncoders;

	//res_state	resampler;
	//int	initializedResampler;
	void (*sourceURLCallback)(void *, void *);
	void (*destURLCallback)(void *, void *);
	void (*serverStatusCallback)(void *, void *);
	void (*generalStatusCallback)(void *, void *);
	void (*writeBytesCallback)(void *, void *);
	void (*serverTypeCallback)(void *, void *);
	void (*serverNameCallback)(void *, void *);
	void (*streamTypeCallback)(void *, void *);
	void (*bitrateCallback)(void *, void *);
	void (*VUCallback)(int, int);
	long	startTime;
	long	endTime;
	char_t	sourceDescription[255];

	char_t	gServerType[25];

	unsigned long result;

	DWORD           dwSamples;

	char_t	gOggEncoderText[255];
	int		gForceStop;

	long	lastX;
	long	lastY;
	long	lastDummyX;
	long	lastDummyY;

	ogg_stream_state os;
	vorbis_dsp_state vd;
	vorbis_block     vb;
	vorbis_info      vi;

	unsigned long samplesInput, maxBytesOutput;
    int     encoderNumber;
    bool    forcedDisconnect;
    time_t     forcedDisconnectSecs;
};


int initializeencoder(edcastGlobals *g);
void getCurrentSongTitle(edcastGlobals *g, char_t *song, char_t *artist, char_t *full);
void initializeGlobals(edcastGlobals *g);
void ReplaceString(char_t *source, char_t *dest, char_t *from, char_t *to);
int connectToServer(edcastGlobals *g);
int disconnectFromServer(edcastGlobals *g);
int do_encoding(edcastGlobals *g, short int *samples, int numsamples, int nch);
void URLize(char_t *input, char_t *output, int inputlen, int outputlen);
int updateSongTitle(edcastGlobals *g, int forceURL);
int setCurrentSongTitleURL(edcastGlobals *g, char_t *song);
int ogg_encode_dataout(edcastGlobals *g);
int	trimVariable(char_t *variable);
void ErrorMessage(char_t *title, char_t *fmt, ...);
//int setCurrentSongTitle(edcastGlobals *g,char_t *song);
char_t*   getSourceURL(edcastGlobals *g);
void    setSourceURL(edcastGlobals *g,char_t *url);
long    getCurrentSamplerate(edcastGlobals *g);
int     getCurrentBitrate(edcastGlobals *g);
int     getCurrentChannels(edcastGlobals *g);
int handle_output(edcastGlobals *g, float *samples, int nsamples, int nchannels, int in_samplerate);
void setServerStatusCallback(edcastGlobals *g,void (*pCallback)(void *,void *));
void setGeneralStatusCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setWriteBytesCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setServerTypeCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setServerNameCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setStreamTypeCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setBitrateCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setVUCallback(edcastGlobals *g, void (*pCallback)(int, int));
void setSourceURLCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setDestURLCallback(edcastGlobals *g, void (*pCallback)(void *,void *));
void setSourceDescription(edcastGlobals *g, char_t *desc);
int  getOggFlag(edcastGlobals *g);
bool  getLiveRecordingFlag(edcastGlobals *g);
void setLiveRecordingFlag(edcastGlobals *g, bool flag);
void setDumpData(edcastGlobals *g, int dump);
void setConfigFileName(edcastGlobals *g, char_t *configFile);
char_t *getConfigFileName(edcastGlobals *g);
char_t*	getServerDesc(edcastGlobals *g);
int	getReconnectFlag(edcastGlobals *g);
int getReconnectSecs(edcastGlobals *g);
int getIsConnected(edcastGlobals *g);
void setOggEncoderText(edcastGlobals *g, char_t *text);
int getLiveRecordingSetFlag(edcastGlobals *g);
char_t *getCurrentRecordingName(edcastGlobals *g);
void setCurrentRecordingName(edcastGlobals *g, char_t *name);
void setForceStop(edcastGlobals *g, int forceStop);
long	getLastXWindow(edcastGlobals *g);
long	getLastYWindow(edcastGlobals *g);
void	setLastXWindow(edcastGlobals *g, long x);
void	setLastYWindow(edcastGlobals *g, long y);
long	getLastDummyXWindow(edcastGlobals *g);
long	getLastDummyYWindow(edcastGlobals *g);
void	setLastDummyXWindow(edcastGlobals *g, long x);
void	setLastDummyYWindow(edcastGlobals *g, long y);
long	getVUShow(edcastGlobals *g);
void	setVUShow(edcastGlobals *g, long x);
int		getFrontEndType(edcastGlobals *g);
void	setFrontEndType(edcastGlobals *g, int x);
int		getReconnectTrigger(edcastGlobals *g);
void	setReconnectTrigger(edcastGlobals *g, int x);
long GetConfigVariableLong(char_t *appName, char_t *paramName, long defaultvalue, char_t *desc);
char_t	*getLockedMetadata(edcastGlobals *g);
void	setLockedMetadata(edcastGlobals *g, char_t *buf);
int		getLockedMetadataFlag(edcastGlobals *g);
void	setLockedMetadataFlag(edcastGlobals *g, int flag);
void	setSaveDirectory(edcastGlobals *g, char_t *saveDir);
char_t *getSaveDirectory(edcastGlobals *g);
int getSaveAsWAV(edcastGlobals *g);
void setSaveAsWAV(edcastGlobals *g, int flag);
FILE *getSaveFileP(edcastGlobals *g);
long getWritten(edcastGlobals *g);
void setWritten(edcastGlobals *g, long writ);
int deleteConfigFile(edcastGlobals *g);
void	setAutoConnect(edcastGlobals *g, int flag);
void LogMessage(edcastGlobals *g, int type, char_t *source, int line, char_t *fmt, ...);
#endif
