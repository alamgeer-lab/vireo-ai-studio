
import React, { useMemo, useState } from "react";
import {
  SafeAreaView, View, Text, TouchableOpacity, ScrollView, TextInput,
  StyleSheet, StatusBar, Alert, Switch
} from "react-native";

const C = {
  bg: "#090910", panel: "#141421", panel2: "#1B1B2B", line: "#29293B",
  text: "#F5F4FF", muted: "#9291A8", purple: "#8B5CF6", pink: "#D946EF",
  green: "#34D399", amber: "#FBBF24"
};

const initialProjects = [
  { id: 1, title: "Midnight city cinematic", status: "Ready", duration: "00:18", date: "Today" },
  { id: 2, title: "Product launch teaser", status: "Draft", duration: "00:12", date: "Yesterday" },
];

function Pill({ label, active, onPress }) {
  return <TouchableOpacity onPress={onPress} style={[s.pill, active && s.pillActive]}><Text style={[s.pillText, active && {color:"#fff"}]}>{label}</Text></TouchableOpacity>;
}
function Primary({ title, onPress }) {
  return <TouchableOpacity style={s.primary} onPress={onPress}><Text style={s.primaryText}>{title}</Text></TouchableOpacity>;
}
function Header({ title, sub }) {
  return <View style={{marginBottom:22}}><Text style={s.heading}>{title}</Text>{sub ? <Text style={s.sub}>{sub}</Text> : null}</View>;
}
function Card({ children, style }) { return <View style={[s.card, style]}>{children}</View>; }

export default function App() {
  const [tab, setTab] = useState("Home");
  const [mode, setMode] = useState("Text to video");
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("9:16");
  const [duration, setDuration] = useState("15 sec");
  const [style, setStyle] = useState("Cinematic");
  const [voice, setVoice] = useState(true);
  const [captions, setCaptions] = useState(true);
  const [projects, setProjects] = useState(initialProjects);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("Product ad");

  const createProject = () => {
    if (!prompt.trim()) {
      Alert.alert("Add a prompt", "Describe the video you want to create first.");
      return;
    }
    const item = { id: Date.now(), title: prompt.trim().slice(0, 34), status: "Preview ready", duration: duration === "30 sec" ? "00:30" : duration === "15 sec" ? "00:15" : "00:08", date: "Just now" };
    setProjects(p => [item, ...p]);
    setGenerating(true);
    setTab("Projects");
    Alert.alert("Preview created", "Your project has been added. Connect a video-generation API to render a real video.");
  };

  const nav = (name) => setTab(name);
  const tabs = ["Home", "Create", "Templates", "Projects", "Profile"];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <View style={s.topbar}>
        <View style={s.brandMark}><Text style={{fontSize:18}}>✦</Text></View>
        <View style={{flex:1}}><Text style={s.brand}>VIREO <Text style={{color:C.purple}}>AI</Text></Text><Text style={s.brandSub}>STUDIO</Text></View>
        <TouchableOpacity style={s.credits} onPress={()=>nav("Profile")}><Text style={s.creditText}>✦  24 credits</Text></TouchableOpacity>
      </View>

      <View style={{flex:1}}>
        {tab === "Home" && <ScrollView contentContainerStyle={s.content}>
          <View style={s.hero}>
            <Text style={s.eyebrow}>YOUR CREATIVE AI STUDIO</Text>
            <Text style={s.heroTitle}>Ideas into videos.{"\n"}In a few <Text style={{color:"#B794F6"}}>seconds.</Text></Text>
            <Text style={s.heroSub}>Create scroll-stopping videos for every platform with AI.</Text>
            <Primary title="＋  Create a video" onPress={()=>nav("Create")}/>
            <View style={s.heroGlow}/>
          </View>
          <View style={s.rowBetween}><Text style={s.section}>Quick create</Text><Text style={s.mutedSmall}>Choose a workflow</Text></View>
          <View style={s.quickGrid}>
            <TouchableOpacity style={s.quick} onPress={()=>{setMode("Text to video");nav("Create");}}><Text style={s.quickIcon}>✍️</Text><Text style={s.quickTitle}>Text to video</Text><Text style={s.quickSub}>Start with an idea</Text></TouchableOpacity>
            <TouchableOpacity style={s.quick} onPress={()=>{setMode("Image to video");nav("Create");}}><Text style={s.quickIcon}>▧</Text><Text style={s.quickTitle}>Image to video</Text><Text style={s.quickSub}>Animate a photo</Text></TouchableOpacity>
          </View>
          <View style={s.rowBetween}><Text style={s.section}>Recent projects</Text><TouchableOpacity onPress={()=>nav("Projects")}><Text style={s.link}>See all →</Text></TouchableOpacity></View>
          {projects.slice(0,2).map(p=><ProjectRow key={p.id} p={p}/>)}
        </ScrollView>}

        {tab === "Create" && <ScrollView contentContainerStyle={s.content}>
          <Header title="Create video" sub="Bring your next big idea to life."/>
          <Text style={s.label}>WORKFLOW</Text>
          <View style={s.rowWrap}><Pill label="Text to video" active={mode==="Text to video"} onPress={()=>setMode("Text to video")}/><Pill label="Image to video" active={mode==="Image to video"} onPress={()=>setMode("Image to video")}/></View>
          <Card>
            <Text style={s.cardTitle}>{mode === "Text to video" ? "Describe your video" : "Image source"}</Text>
            {mode === "Text to video" ? <TextInput value={prompt} onChangeText={setPrompt} multiline placeholder="A cinematic shot of a sports car driving through a neon-lit city at night..." placeholderTextColor="#77768D" style={s.prompt}/> :
              <TouchableOpacity style={s.upload} onPress={()=>Alert.alert("Image upload", "Connect Expo Image Picker to enable photo selection.")}><Text style={{fontSize:28}}>＋</Text><Text style={s.cardTitle}>Choose an image</Text><Text style={s.mutedSmall}>JPG or PNG · up to 20 MB</Text></TouchableOpacity>}
            <Text style={s.hint}>Tip: Include the subject, setting, camera movement and mood.</Text>
          </Card>
          <Text style={s.label}>VIDEO STYLE</Text>
          <View style={s.rowWrap}>{["Cinematic","Realistic","Anime","3D animation","Minimal"].map(x=><Pill key={x} label={x} active={style===x} onPress={()=>setStyle(x)}/>)}</View>
          <Text style={s.label}>FORMAT</Text>
          <View style={s.rowWrap}>{["9:16","16:9","1:1"].map(x=><Pill key={x} label={x} active={ratio===x} onPress={()=>setRatio(x)}/>)}</View>
          <Text style={s.label}>DURATION</Text>
          <View style={s.rowWrap}>{["8 sec","15 sec","30 sec"].map(x=><Pill key={x} label={x} active={duration===x} onPress={()=>setDuration(x)}/>)}</View>
          <Card>
            <View style={s.settingRow}><View><Text style={s.cardTitle}>AI voiceover</Text><Text style={s.mutedSmall}>Add a natural-sounding narration</Text></View><Switch value={voice} onValueChange={setVoice} trackColor={{true:C.purple,false:"#444"}}/></View>
            <View style={s.separator}/>
            <View style={s.settingRow}><View><Text style={s.cardTitle}>Auto captions</Text><Text style={s.mutedSmall}>Generate subtitles for your video</Text></View><Switch value={captions} onValueChange={setCaptions} trackColor={{true:C.purple,false:"#444"}}/></View>
          </Card>
          <Primary title="✦  Generate video preview" onPress={createProject}/>
          <Text style={[s.mutedSmall,{textAlign:"center",marginTop:10}]}>Preview mode · API connection required for rendering</Text>
        </ScrollView>}

        {tab === "Templates" && <ScrollView contentContainerStyle={s.content}>
          <Header title="Explore templates" sub="A head start for your next video."/>
          {[
            ["Product ad","Showcase products with polished motion.","🛍️"],
            ["Travel reel","Turn destinations into cinematic stories.","🌍"],
            ["Story time","Narrated stories with dynamic visuals.","🎙️"],
            ["Fitness motivation","High-energy edits for your audience.","⚡"],
            ["Food & recipes","Make every dish look irresistible.","🍜"],
            ["Brand announcement","Launch news with a premium look.","✦"]
          ].map(([name,desc,emoji])=><TouchableOpacity key={name} onPress={()=>{setSelectedTemplate(name);setPrompt(`Create a ${name.toLowerCase()} video. ${desc}`);setTab("Create");}} style={s.template}><View style={s.templateArt}><Text style={{fontSize:30}}>{emoji}</Text></View><View style={{flex:1}}><Text style={s.cardTitle}>{name}</Text><Text style={s.mutedSmall}>{desc}</Text></View><Text style={s.link}>Use →</Text></TouchableOpacity>)}
        </ScrollView>}

        {tab === "Projects" && <ScrollView contentContainerStyle={s.content}>
          <Header title="Your projects" sub={`${projects.length} projects in your studio`}/>
          {projects.map(p=><ProjectRow key={p.id} p={p} onDelete={()=>setProjects(items=>items.filter(x=>x.id!==p.id))}/>)}
          {projects.length===0 && <Card><Text style={s.muted}>No projects yet. Create your first video to see it here.</Text></Card>}
          <Primary title="＋  Start a new project" onPress={()=>nav("Create")}/>
        </ScrollView>}

        {tab === "Profile" && <ScrollView contentContainerStyle={s.content}>
          <Header title="Your account" sub="Manage your studio and plan."/>
          <Card style={{alignItems:"center",paddingVertical:26}}>
            <View style={s.avatar}><Text style={{fontSize:27}}>✦</Text></View>
            <Text style={[s.cardTitle,{fontSize:19,marginTop:12}]}>Creator account</Text>
            <Text style={s.mutedSmall}>Free plan</Text>
            <View style={s.creditPanel}><Text style={s.creditBig}>24</Text><Text style={s.mutedSmall}>available credits</Text></View>
            <Primary title="Upgrade to Pro" onPress={()=>Alert.alert("Coming soon","Payments and subscription plans will be enabled when billing is connected.")}/>
          </Card>
          {["Account settings","Generation history","Help & support","Privacy policy","Terms of service"].map(x=><TouchableOpacity key={x} style={s.menuItem} onPress={()=>Alert.alert(x,"This section will be available in the production release.")}><Text style={s.cardTitle}>{x}</Text><Text style={s.muted}>›</Text></TouchableOpacity>)}
          <Text style={[s.mutedSmall,{textAlign:"center",marginTop:18}]}>Vireo AI Studio · MVP 0.1.0</Text>
        </ScrollView>}
      </View>

      <View style={s.tabbar}>{tabs.map(t=><TouchableOpacity key={t} onPress={()=>nav(t)} style={s.tab}><Text style={[s.tabIcon,{color:tab===t?C.purple:C.muted}]}>{({Home:"⌂",Create:"✦",Templates:"▦",Projects:"▤",Profile:"◉"})[t]}</Text><Text style={[s.tabText,{color:tab===t?C.text:C.muted}]}>{t}</Text></TouchableOpacity>)}</View>
    </SafeAreaView>
  );
}

function ProjectRow({p,onDelete}) {
  return <View style={s.project}>
    <View style={s.projectThumb}><Text style={{fontSize:23}}>▶</Text></View>
    <View style={{flex:1}}><Text style={s.cardTitle} numberOfLines={1}>{p.title}</Text><Text style={s.mutedSmall}>{p.date} · {p.duration}</Text><Text style={{color:p.status==="Ready"?C.green:C.amber,fontSize:11,marginTop:4}}>{p.status}</Text></View>
    {onDelete ? <TouchableOpacity onPress={onDelete} style={{padding:8}}><Text style={{color:C.muted}}>✕</Text></TouchableOpacity> : <Text style={s.muted}>•••</Text>}
  </View>;
}

const s = StyleSheet.create({
 safe:{flex:1,backgroundColor:C.bg}, topbar:{height:66,paddingHorizontal:20,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderColor:"#171725"},
 brandMark:{width:38,height:38,borderRadius:13,backgroundColor:"#30204D",alignItems:"center",justifyContent:"center",marginRight:10},
 brand:{fontSize:16,fontWeight:"900",letterSpacing:1.5,color:C.text},brandSub:{fontSize:8,color:C.muted,letterSpacing:3,marginTop:1},
 credits:{backgroundColor:"#211A35",borderWidth:1,borderColor:"#49316F",paddingHorizontal:11,paddingVertical:8,borderRadius:20},creditText:{fontSize:11,color:"#D7C5FF",fontWeight:"700"},
 content:{padding:20,paddingBottom:30},heading:{fontSize:29,fontWeight:"800",color:C.text,letterSpacing:-.7},sub:{fontSize:13,color:C.muted,marginTop:6},
 hero:{backgroundColor:"#1A1530",borderRadius:25,padding:22,overflow:"hidden",borderWidth:1,borderColor:"#3A2B5A",marginBottom:27},
 eyebrow:{color:"#C4A8FF",fontSize:9,fontWeight:"800",letterSpacing:2},heroTitle:{fontSize:32,lineHeight:39,color:C.text,fontWeight:"900",marginTop:13,letterSpacing:-1},heroSub:{fontSize:13,color:"#B7B0C9",lineHeight:20,marginTop:10,marginBottom:20},heroGlow:{position:"absolute",width:150,height:150,borderRadius:100,backgroundColor:"#6D28D9",opacity:.12,right:-55,top:-50},
 primary:{backgroundColor:C.purple,borderRadius:14,paddingVertical:15,paddingHorizontal:18,alignItems:"center",justifyContent:"center"},primaryText:{color:"#fff",fontSize:14,fontWeight:"800"},
 rowBetween:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:13},section:{fontSize:17,fontWeight:"800",color:C.text},mutedSmall:{fontSize:11,color:C.muted},link:{color:"#B794F6",fontWeight:"700",fontSize:12},
 quickGrid:{flexDirection:"row",gap:12,marginBottom:27},quick:{flex:1,backgroundColor:C.panel,borderRadius:18,borderWidth:1,borderColor:C.line,padding:15},quickIcon:{fontSize:24,marginBottom:12},quickTitle:{fontSize:13,color:C.text,fontWeight:"800"},quickSub:{fontSize:10,color:C.muted,marginTop:5},
 card:{backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:18,padding:16,marginBottom:17},cardTitle:{fontSize:14,fontWeight:"800",color:C.text},prompt:{color:C.text,minHeight:112,textAlignVertical:"top",fontSize:13,lineHeight:20,marginTop:12},hint:{fontSize:10,color:C.muted,marginTop:10,lineHeight:15},
 label:{fontSize:10,color:C.muted,fontWeight:"800",letterSpacing:1.4,marginBottom:10,marginTop:8},rowWrap:{flexDirection:"row",flexWrap:"wrap",gap:8,marginBottom:17},pill:{borderWidth:1,borderColor:C.line,backgroundColor:C.panel,paddingVertical:9,paddingHorizontal:13,borderRadius:22},pillActive:{backgroundColor:"#39265D",borderColor:C.purple},pillText:{fontSize:11,color:C.muted,fontWeight:"700"},
 upload:{height:145,borderWidth:1,borderStyle:"dashed",borderColor:"#51436C",borderRadius:14,alignItems:"center",justifyContent:"center",gap:7,marginTop:14,backgroundColor:"#191627"},
 settingRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingVertical:5},separator:{height:1,backgroundColor:C.line,marginVertical:12},
 template:{flexDirection:"row",alignItems:"center",gap:13,padding:12,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:17,marginBottom:11},templateArt:{width:58,height:58,borderRadius:14,backgroundColor:"#29203F",alignItems:"center",justifyContent:"center"},
 project:{flexDirection:"row",alignItems:"center",gap:12,padding:12,backgroundColor:C.panel,borderWidth:1,borderColor:C.line,borderRadius:17,marginBottom:11},projectThumb:{width:58,height:65,borderRadius:12,backgroundColor:"#30244A",alignItems:"center",justifyContent:"center"},
 tabbar:{height:66,borderTopWidth:1,borderColor:"#222233",backgroundColor:"#10101A",flexDirection:"row",justifyContent:"space-around",alignItems:"center"},tab:{alignItems:"center",justifyContent:"center",minWidth:55},tabIcon:{fontSize:20},tabText:{fontSize:9,marginTop:4,fontWeight:"700"},
 avatar:{width:68,height:68,borderRadius:23,backgroundColor:"#39265D",alignItems:"center",justifyContent:"center"},creditPanel:{backgroundColor:"#1E1930",borderRadius:14,padding:14,alignItems:"center",width:"100%",marginVertical:17},creditBig:{fontSize:30,color:C.text,fontWeight:"900"},menuItem:{flexDirection:"row",justifyContent:"space-between",padding:17,borderBottomWidth:1,borderColor:C.line},muted:{color:C.muted,fontSize:13}
});
