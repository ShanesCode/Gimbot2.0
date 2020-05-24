const frog1 = 'https://media.mnn.com/assets/images/2014/06/desert-rain-frog.png.653x0_q80_crop-smart.jpg';
const frog2 = 'https://78.media.tumblr.com/c00430cdc286552b07a398a4efc3d403/tumblr_oo9inkmWU01uvq9elo7_1280.jpg';
const frog3 = 'http://i0.kym-cdn.com/photos/images/original/001/316/893/673.jpg';
const frog4 = 'https://78.media.tumblr.com/837ee84b7a2dc1d33b5e47f169355d83/tumblr_oo9inkmWU01uvq9elo2_1280.jpg';
const frog5 = 'http://www.factzoo.com/sites/all/img/amphibians/frogs/jabba-ze-rain-frog.jpg';
const frog6 = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Breviceps-adspersus-adspersus.jpg/1200px-Breviceps-adspersus-adspersus.jpg';
const frog7 = 'http://cdn1.arkive.org/media/0E/0E644469-FC40-466D-927F-E8434335C368/Presentation.Large/Giant-rain-frog-in-inflated-posture-on-leaf-litter.jpg';

const frogs = [frog1, frog2, frog3, frog4, frog5, frog6, frog7];

module.exports = {
	name: 'frog',
	description: 'Yay for frogs!',
	cooldown: 5,
	execute(message) {
		const randomFrog = frogs[Math.floor(Math.random() * frogs.length)];
		message.channel.send('Yay for frogs!', { files: [randomFrog] });
	},
};
