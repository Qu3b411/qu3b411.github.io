---
layout: clickfix
title: "A ClickFix GPT, a weaponized MSI, and the implant that RickRolled itself"
description: "A ClickFix lure inside a community GPT, the recovered payload, and an isolated lab replay."
date: 2026-10-08
permalink: /clickfix/
published: true
---

# Public Advisory

<aside class="callout callout--danger" role="note">
<strong>The fix is the attack.</strong> In this lure, following the website's "verification" instructions is what would infect the computer. If a website tells you to press <kbd>Win</kbd>+<kbd>R</kbd>, then <kbd>Ctrl</kbd>+<kbd>V</kbd>, then <kbd>Enter</kbd> to "verify" anything — stop and close the tab. No legitimate service needs that sequence.
</aside>

**If you only read one section, read this one. Show it to anyone who might follow a fake verification prompt.**

I searched for "gpt". A Google ad redirect led to a Custom GPT on the real ChatGPT site, where a fake service notice pointed me to a "backup" page. That page pretended to verify I was human and told me to run a command on my own computer.

Those three keys are the warning:

- **`Windows key + R`, `Ctrl + V`, `Enter` runs a command.** The first keys open Windows Run. The next keys paste what the page placed on the clipboard; Enter executes it.
- **Cloudflare does not need Windows Run or PowerShell to check a browser session.** Close the tab if a page asks you to open either one.
- **The address bar is not enough here.** The GPT was on `chatgpt.com`, but the message came from whoever built that Custom GPT.

**What to do instead:**

- Close the tab. Do not paste or run the command, even if the page says your account or service will stop working.
- If you are unsure, ask someone you trust before following the instructions.
- If you already ran it, disconnect that computer from the internet and get help from someone who can examine it. This trick can install a hidden program.

I did not run the command on my host. The payload targeted Windows. The warning sign was a website telling me to execute a command outside the browser.

---

**Publication note:** While preparing this research for release, I discovered [Huntress had already published analysis](https://www.huntress.com/blog/chatgpt-custom-gpts-clickfix-rat) of the same “Plus 5.6” campaign and the Stardock/Build.dat loader chain. That work has publication priority on those overlapping findings. My investigation was conducted independently and was substantially complete before I found their report. The protocol reconstruction, controlled tasking, and reproducible lab described here were developed from my own captured artifacts and testing.

---

# Executive Summary

My search for `gpt` crossed a Google ad redirect and landed on “Plus 5.6,” a Custom GPT on the real ChatGPT site. Its fake service notice led to a Google Sites page posing as a Cloudflare check. The browser record shows that page loading, but not the click that opened it. A later copy of the page placed a PowerShell launcher on the clipboard and instructed the visitor to press `Win+R`, `Ctrl+V`, `Enter`. On Windows, that sequence would run the launcher, fetch two more PowerShell stages, and silently install an MSI. The attack depended on the visitor running the command.

I collected the Windows payload afterward without running that command on my host. In the isolated lab, the MSI hid its installed product, side-loaded a DLL chain, and started an implant with persistence and task-handling code. I reconstructed enough of its binary protocol to send a type-1 shell task. The implant returned my marker and opened a local page. I used the same task path for the prepared demo, which opens a locally served Rick Astley video. The release contains the primed infected VM, emulator, controller, and harness used for that run.

The saved samples came after the browser visit, so I cannot assign their exact bytes to that first visit. The public package reproduces the isolated tasking result; the browser, mailbox, and raw lab captures remain private. I reported the conversation under **Cyber attacks** and sent the conversation and fake-site URLs through OpenAI's report form. The reply to my first report said **“no policy violation.”** OpenAI later acknowledged my report of the GPT itself under **Scams and/or fraud**, but I found no decision on that report. The GPT later became unavailable; I do not know why.

---

# A ClickFix GPT, a weaponized MSI, and the implant that RickRolled itself

*A Custom GPT on the real ChatGPT site pointed me to a fake verification check. I followed the saved payload into an isolated lab and made its implant play Rick Astley.*

**Research materials:** [qu3b411/clickfix repository](https://github.com/qu3b411/clickfix) · [prepared lab release](https://github.com/qu3b411/clickfix/releases/tag/iclickrickroll-lab-v1) · [demo-evidence guide](https://github.com/qu3b411/clickfix/blob/main/docs/demo-evidence.md) · [sample and lab safety](https://github.com/qu3b411/clickfix/blob/main/SAFETY.md).

*Incident: September 25, 2026*

---

## DFIU

*(Don't Fuck It Up. The video is a joke; the VM runs a real implant.)*

The archive contains an infected Windows VM and live malware on its disks. If you only want to see the result, watch the video below. There is no reason to unpack the lab for that.

If you do run the lab, use a dedicated host you can afford to wipe and read the included warning first. The shipped harness checks its own VirtualBox setup, but you are responsible for the host around it.

- **Keep the VMs on the isolated internal network.** No NAT, bridged, or host-only adapter. No route to your LAN or the internet. Check the adapter settings before booting and again if you change anything.
- **Keep host integration off.** No shared folders, shared clipboard, drag-and-drop, or Guest Additions in the infected Windows VM. Do not give the malware a convenient path back to the host.
- **Do not point the sample at the real C2.** The address in this article is a live indicator. Inside the lab it is redirected to a local controller, with forwarding disabled. Do not copy that address into a browser or run the sample on a normal network.
- **Treat the downloads as hazardous.** The password is an acknowledgement, not a safety feature. Do not unpack the archive in Downloads and browse around casually. Keep the samples encrypted except inside the intended research environment.
- **Stop if an isolation check fails.** Do not comment it out to get to the Rickroll. Inspect the VM settings and start again from a clean disposable clone.
- **Assume your guest is compromised after the demo.** Do not log into personal accounts in it. Do not give it secrets. Revert or delete disposable clones when you finish.

---

## Technical Teardown

My browser record reaches the fake check. I collected the later stages separately, so the runtime findings below come from those saved bytes inside the lab.

### The route to the fake check

Firefox records the `gpt` search, a Google `/aclk` ad redirect, and the “Plus 5.6” GPT. The click identifier matches across the redirect. I remember a strange “New chat” transition, but the browser record does not place it.

<figure>
  <img src="/assets/clickfix/google-sponsored-result-later.png"
       alt="A later Google search for gpt showing a sponsored ChatGPT result and a hovered google.com/aclk link">
  <figcaption>
    I repeated the search while preparing this article and saw another sponsored ChatGPT result with a Google <code>/aclk</code> link. This is a later screenshot, not the incident ad; it does not establish that the later result was malicious. I cropped out the browser profile and removed the ad URL's query parameters.
  </figcaption>
</figure>

The GPT displayed the label “By community builder.” I started a conversation with “Extract avatar” and received a **Service Availability Notice** claiming trouble with the primary service. It offered `sites[.]google[.]com/view/antibot172881` as a backup. The screenshot records the notice; the browser record shows the site loading afterward, though it does not preserve the click. The notice was third-party GPT content inside a genuine ChatGPT page. I have no evidence that OpenAI authored it.

### Fake Cloudflare verification

My screenshot shows the Google Sites page rendering a full-screen **Cloudflare-styled "Human Verification"** interface naming `chatgpt.com`, with instructions to press **`Win+R`, `Ctrl+V`, `Enter`.**

<figure>
  <img src="/assets/clickfix/fake-cloudflare-verification.png"
       alt="Fake Cloudflare 'Human Verification' modal instructing the user to press Win+R, Ctrl+V, Enter">
  <figcaption>
    The fake verification prompt at
    <code>sites[.]google[.]com/view/antibot172881</code>. It was hosted on Google Sites and
    imitated Cloudflare. I stripped the crop's metadata; its hash and handling notes are in
    <a href="https://github.com/qu3b411/clickfix/tree/main/images/incident">images/incident</a>.
  </figcaption>
</figure>

The checkbox is theater. The saved page puts a PowerShell launcher in an offscreen textarea, selects it, and calls `document.execCommand('copy')`. By the time the visitor presses `Ctrl+V`, the command is on the clipboard. The page also swaps visible `google.com` text for `chatgpt.com`, blocks developer-tool shortcuts, and posts telemetry to a runtime-origin `api.php`. It references an external script and a panel address I did not capture, so I cannot say whether either ran.

### Payload retrieval

The clipboard launcher fetched `/12` from `1450003207`, wrote a PowerShell script under `%TEMP%`, and ran it. That number is decimal IPv4 notation for `86[.]109[.]75[.]7`: the request avoids a dotted address and a DNS lookup. The exact launcher bytes are preserved in the password-protected page sample. The three-stage retrieval was:

1. `GET /12` → `12.ps1` (800 bytes) — sets TLS 1.2, a Chrome-like UA, `DownloadString` of `/s/19481b28bd67`, pipes the result into a hidden `powershell -nop -w hidden -ep bypass -`.
2. `GET /s/19481b28bd67` → `stage3.txt` (54,235 bytes, arithmetic-obfuscated) — decodes to a downloader of `/app/19481b28bd67/IconEdit2Turb.msi`, saved to `%TEMP%`, `Unblock-File`, then `msiexec /i … /qn /norestart` with a hidden window.
3. `GET /app/19481b28bd67/IconEdit2Turb.msi` → the weaponized MSI (5,069,824 bytes).

I saved all three responses after the browser visit and decoded the obfuscated middle response for analysis.

> **Artifacts:** the page, both PowerShell stages, and the MSI are published as live samples — in password-protected archives only — under [`malware/`](https://github.com/qu3b411/clickfix/tree/main/malware). Original and archive hashes are in [`malware/README.md`](https://github.com/qu3b411/clickfix/blob/main/malware/README.md); repository file hashes are in [`manifests/SHA256SUMS.txt`](https://github.com/qu3b411/clickfix/blob/main/manifests/SHA256SUMS.txt). **Read [`SAFETY.md`](https://github.com/qu3b411/clickfix/blob/main/SAFETY.md) first.**

### Inside the MSI

<details markdown="1">
<summary><strong>MSI tables and side-load chain</strong></summary>

The MSI calls itself “Stardock Smart DeElevation Tool” (v7.12.0, “Filezo,” Advanced Installer). It installs under the user's LocalAppData `Programs` directory and sets `ARPSYSTEMCOMPONENT=1`, which hides the product from the installed-programs list. A WiX `WixShellExec` custom action (sequence 6602, after `InstallFinalize`) launches `DeElevate64.exe` without another user action.

The dependency chain is `DeElevate64.exe` → `DeElevator64.dll!RunNonElevated` → `I++u.dll!contentsStroke` → `senddmp.resources.dll`, with `res.dll` loaded dynamically. `DeElevator64.dll` has its import directory in `.rsrc` and a certificate directory pointing past EOF. Those changes identify it as a modified loader, despite the product branding.

</details>

### The Build.dat graft

`Build.dat` presents as a 36-entry NuGet-style ZIP. A 341,523-byte region has been inserted at `[0x5847b, 0xaba8e)`; removing exactly that range from an analysis copy restores a ZIP whose 36 members all pass CRC. `I++u.dll` reads the inserted bytes, transforms them, copies the result into executable memory allocated by `senddmp.resources.dll`, and passes the buffer to `EnumSystemCodePagesW` as a callback. That callback executes the decoded code.

My first decoder got the XOR loop wrong because I had not tracked all three changing state registers. Once I did, the inserted region decoded to valid x64 position-independent code. I kept the corrected decoder and recovered bytes in my analysis record.

### An isolated execution

Static analysis showed a loader and task-handling code. I needed to see whether the installed process stayed alive long enough to use either. I built a disposable Windows 11 VM with one NIC on a private VirtualBox internal network and no host integration. Sysmon, Procmon, ETW collection for DNS, Task Scheduler, and WinHTTP, plus process, socket, and memory-dump watchers from a read-only tools ISO recorded the run. I took a clean powered-off snapshot before introducing the sample and checked isolation again afterward.

The released victim comes from that sealed run. Defender real-time protection was on with old offline signatures and a narrow exclusion for the specimen's install folder. It did not quarantine the specimen in this run.

### Network emulation

I gave the Windows guest the services the sample expected without giving it an external route. An Ubuntu 24.04 VM ran INetSim and dnsmasq on the same private segment: wildcard DNS to `10.77.86.2`, simulated HTTP/HTTPS, DHCP, **no default route, IP forwarding 0**. I checked the service path with a clean probe VM before attaching the infected guest. Later, a local replay server returned the three exact saved stage bodies so the ClickFix chain could run inside the lab.

### Finding the C2 path

Once the implant stayed resident, I watched it query `dns.google`, attempt TLS with SNI `dns.google`, then attempt TCP to **`45.140.205.28:443`**, a candidate C2 endpoint. The first SYNs went unanswered. I then redirected that destination to a passive listener inside the emulator. **No byte was sent to the real address.** The listener received 18 structured binary messages totaling 58,626 bytes and sent zero bytes back.

### Reconstructing the protocol

<details markdown="1">
<summary><strong>Wire format and registration profile</strong></summary>

The messages have a **120-byte arithmetic header** (constant `K=0x16df3822a8`), **88-byte field descriptors**, and XOR-transformed field data. The UTC timestamp decoded from the client frame preceded the socket watcher's first observation of the same source port in every stream, checking the decode against an independent clock. The body contains 26 registration fields: username `analyst`, computer `CFX-LAB`, Windows version, security product, CPU/GPU, locale, client version, executable, and install path. I mapped receive-side action tags (`0x56bc`, `0x56be`, `0x5b90`, `0x5608`, …) and checked the frame-length arithmetic against the captures. The [protocol specification](https://github.com/qu3b411/clickfix/blob/main/c2/protocol-spec.md) has the wire details.

</details>

### Why the implant stayed alive

The first direct-MSI run persisted; several shorter runs did not. I traced the difference to a “Syntax error” dialog left open by the de-elevation wrapper. The dialog kept `DeElevate64.exe` alive while the malicious DLL ran on another thread. The decoded task script waits **150 seconds** and **875 seconds** before writing the Run value and scheduled task. When I left the dialog open in a controlled run, both writes appeared. Process lifetime explained the difference in these runs.

### Process tree and Sysmon

Sysmon showed the installer chain `msiexec.exe → msiexec.exe → 32-bit msiexec.exe → DeElevate64.exe`, the DLL loads, and the delayed HKCU Run value and scheduled task. Saved-state resume shifted the guest clock relative to the emulator, so I matched network events by source port and packet order.

### A local controller

The receive-side reconstruction identified a type-1 task container, a start-shell field, and a field that feeds UTF-16LE command text to `cmd.exe`. I wrote a controller under `c2/` that binds to `10.77.86.2:8443`, rejects peers outside `10.77.86.0/24`, and emits the fixed frames needed to test that path. It has **no upstream or forwarding code**. Task types 2–4 appear in the disassembly; I did not exercise them.

### Task execution

I tested the reconstructed frames against the resident implant:

- **State flip:** I changed decoded field `0x56bc` from `01` to `00` and back. The live client's connection lifetime and reconnect cadence changed with it, then returned to the first behavior. Both NIC captures contain my generated frames.
- **Type-1 shell:** I sent a fixed task that made the implant spawn `cmd.exe`. It returned `CFX_RICKROLL_TASK_PROOF` and echoed the shell PID in reply field `0x5975`. My next shell-input frame opened Edge at a local page. This first probe did not play the video; the prepared demo used the same task path to serve it later.

Sysmon recorded `DeElevate64.exe → cmd.exe → msedge.exe` during my controlled probe. My controller sent the command that opened Edge; I did not observe attacker tasking. I checked the implant’s replies against captures from both NICs and the Sysmon process tree. The [demo-evidence guide](https://github.com/qu3b411/clickfix/blob/main/docs/demo-evidence.md) separates this probe from the later video presentation.

### What happened after I reported it

I reported the “Plus 5.6” conversation in ChatGPT under **Cyber attacks**. The receipt names that category and says it concerned a ChatGPT conversation, but does not print the conversation ID. I had no unrelated reports from that account.

I also submitted OpenAI's **Report Content form**. Firefox saved the exact GPT conversation URL and fake-site URL together when I submitted it. The case-system email acknowledges receipt but does not repeat either URL. Both submissions preceded the negative reply; I cannot tell whether OpenAI joined them internally.

The same reporting mail system that acknowledged the conversation report then said it had reviewed the content and **“found no policy violation.”** The reply lacks a case ID, conversation ID, and GPT name, and I cannot see what the reviewer opened. The conversation I reported led Windows users to a fake verification page instructing them to run a command; the form carried both URLs. That was enough to inspect the GPT, its outbound link, and whether other users had reached it. The negative answer may reflect intake, routing, or review; the message does not say which. I do not know whether a separate investigation followed.

After reading that answer, I reported the **GPT itself** under **Scams and/or fraud**. The acknowledgment names “Plus 5.6”; I found no decision on that report. Some of the report emails surfaced only when I revisited the mailbox. Their headers show delivery on the incident date, not when I read them. The GPT later became unavailable. I cannot establish why.

---

## RickRoll

<figure class="video-embed" data-status="available">
  <iframe src="https://www.youtube-nocookie.com/embed/VRApu5B4TR8"
          title="Plus 5.6: Community Builder, Meet Rickroll — isolated malware lab demo"
          loading="lazy"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
  <p><a href="https://www.youtube.com/watch?v=VRApu5B4TR8">Watch the recorded demo on YouTube</a></p>
  <figcaption>
    The infected Windows VM is on the left; my local controller is on the right. After
    the implant checks in, I send a shell task and Edge opens the locally served video
    with sound. The victim and emulator use one VirtualBox internal network. The sample's
    C2 address is redirected inside that network; neither VM has an external route.
    Served media: <a href="https://commons.wikimedia.org/wiki/File:Rick_Astley_-_Never_Gonna_Give_You_Up_-_Festival_de_Vi%C3%B1a_del_Mar_2016_HD.webm">"Never Gonna Give You Up (Festival de Viña del Mar 2016)"</a>
    by FESTIVALDEVINACHILE, via Wikimedia Commons,
    <a href="https://creativecommons.org/licenses/by/3.0/">CC&nbsp;BY&nbsp;3.0</a>.
    The source file is unmodified.
  </figcaption>
</figure>

The video uses the shell path I tested with the earlier local-page probe. In that probe, both NIC captures contain my task frames and the implant's replies; Sysmon records `DeElevate64.exe → cmd.exe → msedge.exe` after my controller sent the command. The [protocol specification](https://github.com/qu3b411/clickfix/blob/main/c2/protocol-spec.md) gives the frame format, and the [demo-evidence guide](https://github.com/qu3b411/clickfix/blob/main/docs/demo-evidence.md) identifies which records belong to the probe and which to the video.

The [release manifest](https://github.com/qu3b411/clickfix/blob/main/iclickrickroll/ARCHIVE-SHA256SUMS) hashes each archive part and the assembled ZIP. The package contains the saved VM state from which another researcher can repeat the demo.

### How do I make iClickRickroll?

**[Get the prepared lab](https://github.com/qu3b411/clickfix/releases/tag/iclickrickroll-lab-v1)** from the `qu3b411/clickfix` release. The archive holds the **live infected Windows VM** with its saved RAM state, the emulator, controller, two ISOs, and harness. The VM folders preserve the resident implant's state; an OVA would discard that saved RAM.

The encrypted ZIP is 21.3 GiB and expands to about 118.6 GB before the harness makes disposable run clones. GitHub's per-file limit required twelve parts.

Read the [warning](https://github.com/qu3b411/clickfix/blob/main/iclickrickroll/MALWARE-WARNING.txt) and inspect the [guided setup script](https://github.com/qu3b411/clickfix/blob/main/iclickrickroll/setup-lab.sh) before running it. Do not pipe a fetched script into a shell.

```sh
git clone https://github.com/qu3b411/clickfix.git
cd clickfix
bash iclickrickroll/setup-lab.sh
```

The terminal guide asks before downloading the twelve parts, verifies each SHA-256 and the joined ZIP, then asks again before extraction and import. You type `IAcknowledgeMaliciousContent` once; it is both the acknowledgement and the ZIP password. The script passes it to `unzip` without putting it in process arguments. It verifies the extracted files, offers the Debian/Ubuntu packages listed in `packages.json`, and imports both baselines into `iclickrickroll-research/` beside the clone. On the dedicated Linux/VirtualBox host, run the command it prints:

```sh
cd ../iclickrickroll-research/iclickrickroll-lab/reproducible-lab
make iclickrickroll
```

The harness checks that the VMs have **one VirtualBox internal network**, no NAT, bridged, or host-only adapter, and no emulator forwarding. It starts disposable clones of both baselines and opens the local controller. The emulator redirects the sample's hardcoded C2 address to my controller inside the lab, with no route to the real endpoint.

Type `send-rick` in the controller pane. The implant may take a while to beacon; the command waits for it. When it checks in, the task opens Edge fullscreen on the **locally served** Creative Commons concert video. `make clean` removes the run clones. The [full lab instructions](https://github.com/qu3b411/clickfix/blob/main/iclickrickroll/README.md) cover prerequisites, hashes, manual acquisition, and handling.

---

## To the Malware Author

Your fake verification page appeared after a search ad redirect and a community GPT. I cannot tell who controlled the ad, or whom you intended to catch. The chain reached my browser, and I saved the page instead of running the command.

The MSI hid its product with `ARPSYSTEMCOMPONENT=1`, launched `DeElevate64.exe`, and side-loaded through `DeElevator64.dll → I++u.dll`. The latter read a 341,523-byte graft from a NuGet-looking ZIP and passed its decoded code to a callback loader. I got the XOR loop wrong on the first pass. All three state registers changed on every byte; once I accounted for that, the graft decoded cleanly.

The `.raw` container held 1,128 records, including a delayed persistence script in record 4 and an x64 stager in record 1118. In my runs, your de-elevation wrapper's "Syntax error" dialog kept the host process alive long enough for the delayed Run-key and scheduled-task writes. Closing it early stopped that path. The dialog was doing more for persistence than the installer label suggested.

Your implant then tried to reach `45.140.205.28` and registered with my local listener instead. Its 26-field profile arrived over a protocol with a 120-byte arithmetic header, 88-byte descriptors, and XOR-coded fields. I changed decoded flag `0x56bc` between `01` and `00` and watched the client change its reconnect behavior in both directions. I then sent a fixed type-1 shell task; it spawned `cmd.exe` and returned my marker with the shell PID in `0x5975`.

The first probe opened a local page. In the prepared lab, the same task path opened Edge on the locally served Rick Astley video. I did not touch your server, see your real tasking, or exercise the other task types. The network had no route to you.

**You tried to get me to paste your command. I got your implant to run one of mine.**
